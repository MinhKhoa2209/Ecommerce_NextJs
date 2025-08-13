"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import useBasketStore from "@/store/store";

function SuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
    const removeItemsFromBasket = useBasketStore(
    (state) => state.removeItemsFromBasket
  );

  useEffect(() => {
    const itemsBoughtStr = localStorage.getItem("itemsBought");
    const savedOrderNumber = localStorage.getItem("orderNumber");

    if (itemsBoughtStr && savedOrderNumber === orderNumber) {
      try {
        const itemsBought = JSON.parse(itemsBoughtStr);
        removeItemsFromBasket(itemsBought);
        localStorage.removeItem("itemsBought");
        localStorage.removeItem("orderNumber");
      } catch (error) {
        console.error("Failed to parse itemsBought from localStorage:", error);
      }
    }
  }, [orderNumber, removeItemsFromBasket]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-center mb-8">
          <div className="bg-green-100 rounded-full flex items-center justify-center h-16 w-16">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-6 text-center">
          Thank You for Your Order!
        </h1>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Your order has been confirmed and will be shipped shortly.
          </p>
          {orderNumber && (
            <p className="text-gray-600 flex items-center space-x-2">
              <span>Order Number:</span>
              <span className="font-mono text-sm">{orderNumber}</span>
            </p>
          )}
        </div>

        <div className="space-y-4 text-green-600">
          <p className="text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/orders">View Order Details</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;