"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth, SignInButton } from "@clerk/nextjs";
import useBasketStore from "@/store/store";
import AddToBasketButton from "@/components/AddToBasketButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import Loader from "@/components/Loader";
import {
  createCheckoutSession,
  Metadata,
} from "@/actions/createCheckoutSession";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { ShoppingCart, MapPin, CreditCard, Truck } from "lucide-react";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

function BasketPage() {
  const groupedItems = useBasketStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const clerkUser = useUser().user;
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);

  const [selectedItems, setSelectedItems] = useState<{ [id: string]: boolean }>(
    {}
  );
  const removeItemsFromBasket = useBasketStore(
    (state) => state.removeItemsFromBasket
  );

  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">(
    "stripe"
  );

  useEffect(() => {
    setIsClient(true);

    if (!clerkUser) return;

    const storedAddresses = clerkUser.publicMetadata?.addresses;
    if (Array.isArray(storedAddresses)) {
      setAddresses(storedAddresses);
      const defaultAddr = storedAddresses.find((a) => a.isDefault) || null;
      setShippingAddress(defaultAddr);
    } else {
      setAddresses([]);
      setShippingAddress(null);
    }

    setSelectedItems({});
  }, [clerkUser, groupedItems]);

  if (!isClient) {
    return <Loader />;
  }

  const itemsToBuy = groupedItems.filter(
    (item) => selectedItems[item.product._id]
  );

  if (groupedItems.length === 0) {
    return (
      <div className="mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center rounded-xl">
        <div className="mb-4 text-red-500 hover:text-red-600 drop-shadow-md transition duration-300">
          <ShoppingBasket className="w-16 h-16" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-extrabold mb-4 text-gray-800 tracking-wide">
          Your Basket is Empty
        </h1>
        <p className="text-gray-600 text-lg mb-6 max-w-md">
          Looks like you have not added anything to your basket yet. Start
          exploring our amazing products!
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition duration-300 ease-in-out"
        >
          Browse Products
        </Link>
      </div>
    );
  }
  const handleCheckoutStripe = async () => {
    if (!isSignedIn) return;
    if (!shippingAddress) {
      alert(
        "No default shipping address found. Please add one before checkout."
      );
      return;
    }
    if (itemsToBuy.length === 0) {
      alert("Please select at least one product to buy.");
      return;
    }
    setIsLoading(true);

    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: clerkUser?.fullName || "Guest",
        customerEmail:
          clerkUser?.emailAddresses?.[0]?.emailAddress ?? "unknown",
        clerkUserId: clerkUser!.id,
        shippingAddressJson: JSON.stringify(shippingAddress),
      };

      const checkoutUrl = await createCheckoutSession(itemsToBuy, metadata);
      if (checkoutUrl) {
        localStorage.setItem("itemsBought", JSON.stringify(itemsToBuy));
        localStorage.setItem("orderNumber", metadata.orderNumber);
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error during Stripe checkout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutCOD = async () => {
    if (!isSignedIn) return;
    if (!shippingAddress) {
      alert(
        "No default shipping address found. Please add one before checkout."
      );
      return;
    }
    if (itemsToBuy.length === 0) {
      alert("Please select at least one product to buy.");
      return;
    }

    setIsLoading(true);
    try {
      const metadata: Metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: clerkUser?.fullName || "Guest",
        customerEmail:
          clerkUser?.emailAddresses?.[0]?.emailAddress ?? "unknown",
        clerkUserId: clerkUser!.id,
        shippingAddressJson: JSON.stringify(shippingAddress),
      };

      const res = await fetch("/api/orders/create-cod-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metadata,
          items: itemsToBuy,
        }),
      });

      if (!res.ok) throw new Error("Failed to create COD order");

      const data = await res.json();
      if (data.successUrl) {
        localStorage.setItem("itemsBought", JSON.stringify(itemsToBuy));
        localStorage.setItem("orderNumber", metadata.orderNumber);
        window.location.href = data.successUrl;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (paymentMethod === "stripe") {
      handleCheckoutStripe();
    } else {
      handleCheckoutCOD();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-extrabold mb-6">Your Basket</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Danh sách sản phẩm */}
        <div className="flex-grow overflow-y-auto max-h-[70vh] space-y-4">
          {groupedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
              <ShoppingCart className="w-20 h-20 mb-4" strokeWidth={1.5} />
              <h2 className="text-2xl font-semibold mb-2">
                Your Basket is Empty
              </h2>
              <p className="mb-4">Add some amazing products to your basket!</p>
              <Link href="/" className="btn-primary px-6 py-3 rounded-full">
                Browse Products
              </Link>
            </div>
          ) : (
            groupedItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center bg-white rounded-lg border border-gray-300 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedItems[item.product._id] || false}
                  onChange={() =>
                    setSelectedItems((prev) => ({
                      ...prev,
                      [item.product._id]: !prev[item.product._id],
                    }))
                  }
                  className="w-6 h-6 mr-4 cursor-pointer accent-blue-600"
                />
                {item.product.image && (
                  <Image
                    src={imageUrl(item.product.image).url()}
                    alt={item.product.name || "Product image"}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover mr-4 flex-shrink-0"
                  />
                )}
                <div className="flex flex-col flex-grow min-w-0">
                  <h3 className="font-semibold text-lg truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-blue-600 font-semibold mt-1">
                    ${((item.product.price ?? 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
                <AddToBasketButton product={item.product} />
              </div>
            ))
          )}
        </div>

        {/* Right: Summary + Address + Payment */}
        <div className="w-full lg:w-96 sticky top-8 self-start bg-gray-100 border border-gray-200 rounded-lg shadow p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Shipping Address</h2>
          </div>
          {shippingAddress ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-blue-50 p-4 rounded border border-blue-200">
              {[
                shippingAddress.fullName,
                shippingAddress.phone,
                shippingAddress.line1,
                shippingAddress.line2,
                `${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.postalCode}`,
                shippingAddress.country,
              ]
                .filter(Boolean)
                .join(", ")}
            </div>
          ) : (
            <div className="text-red-500 font-medium">
              No default shipping address found.{" "}
              <Link href="/address-book" className="text-blue-600 underline">
                Add one now
              </Link>
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between mb-1">
              <span>Items:</span>
              <span>{itemsToBuy.reduce((a, i) => a + i.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold border-t pt-2">
              <span>Total:</span>
              <span>
                $
                {itemsToBuy
                  .reduce(
                    (total, item) =>
                      total + (item.product.price ?? 0) * item.quantity,
                    0
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
            <div className="flex gap-4">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded border ${
                  paymentMethod === "stripe"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                } transition`}
                onClick={() => setPaymentMethod("stripe")}
              >
                <CreditCard className="w-5 h-5" />
                Stripe
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded border ${
                  paymentMethod === "cod"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                } transition`}
                onClick={() => setPaymentMethod("cod")}
              >
                <Truck className="w-5 h-5" />
                Cash on Delivery
              </button>
            </div>
          </div>

          {isSignedIn ? (
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {paymentMethod === "stripe"
                ? "Checkout with Stripe"
                : "Checkout with Cash on Delivery"}
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition">
                Sign in to Checkout
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}
export default BasketPage;
