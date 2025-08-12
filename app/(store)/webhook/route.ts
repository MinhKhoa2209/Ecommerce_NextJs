import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log("& Stripe webhook secret is not set.");
    return NextResponse.json(
      { error: "Stripe webhook secret is not set" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const order = await createOrderInSanity(session);
      
      console.log("Order created in Sanity:", order);
    } catch (err) {
      console.error("Error creating order in Sanity:", err);
      return NextResponse.json(
        { error: "Error creating order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
async function createOrderInSanity(session: Stripe.Checkout.Session) {


  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
    payment_method_types,
  } = session;

  const {
    orderNumber,
    customerName,
    customerEmail,
    clerkUserId,
    shippingAddressJson,
  } = metadata as Metadata & { shippingAddressJson?: string };

  let shippingAddressObj = null;
  if (shippingAddressJson) {
    try {
      shippingAddressObj = JSON.parse(shippingAddressJson);
    } catch (err) {
      console.warn("Failed to parse shippingAddressJson", err);
    }
  }

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(id, {
    expand: ["data.price.product"],
  });

  let paymentMethod = "";
  if (payment_method_types?.length) {
    paymentMethod = payment_method_types.join(", ");
  }

  if (payment_intent && typeof payment_intent === "string") {
    const pi = await stripe.paymentIntents.retrieve(payment_intent);

    if (pi.payment_method) {
      const paymentMethodId =
        typeof pi.payment_method === "string"
          ? pi.payment_method
          : pi.payment_method.id;

      const pm = await stripe.paymentMethods.retrieve(paymentMethodId);

      if (pm.card) {
        paymentMethod = `${pm.card.brand.toUpperCase()} •••• ${pm.card.last4}`;
      }
    }
  }

  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  // Tạo document order trong Sanity
  const order = await backendClient.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    paymentMethod,
    stripeCustomerId: customer,
    clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
    shippingAddress: shippingAddressObj || null,
  });

  return order;
}