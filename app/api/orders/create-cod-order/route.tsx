import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { Metadata, GroupedBasketItem } from "@/actions/createCheckoutSession";

export async function POST(req: NextRequest) {
  try {
    const {
      metadata,
      items,
    }: { metadata: Metadata; items: GroupedBasketItem[] } = await req.json();

    const sanityProducts = items.map((item) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: item.product._id,
      },
      quantity: item.quantity || 0,
    }));
    const { shippingAddressJson } = metadata as Metadata & {
      shippingAddressJson?: string;
    };

    let shippingAddress = null;
    if (shippingAddressJson) {
      try {
        shippingAddress = JSON.parse(shippingAddressJson);
      } catch (err) {
        console.warn("Failed to parse shippingAddressJson", err);
      }
    }

    const order = await backendClient.create({
      _type: "order",
      orderNumber: metadata.orderNumber,
      paymentMethod: "cod",
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
      stripeCustomerId: null,
      clerkUserId: metadata.clerkUserId,
      customerName: metadata.customerName,
      email: metadata.customerEmail,
      currency: "usd",
      amountDiscount: 0,
      products: sanityProducts,
      totalPrice: items.reduce(
        (total, item) => total + (item.product.price ?? 0) * item.quantity,
        0
      ),
      status: "pending",
      orderDate: new Date().toISOString(),
      shippingAddress: shippingAddress || null,
    });

       const baseUrl =
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_SITE_URL
        : process.env.NEXT_PUBLIC_BASE_URL;


    const successUrl = `${baseUrl}/success?orderId=${order._id}&orderNumber=${metadata.orderNumber}`;

    return NextResponse.json({ successUrl });
  } catch (error) {
    console.error("Error creating COD order:", error);
    return NextResponse.json(
      { error: "Failed to create COD order" },
      { status: 500 }
    );
  }
}
