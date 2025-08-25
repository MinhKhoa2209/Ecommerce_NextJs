"use client";

import React, { useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { formatCurrency } from "@/lib/formatCurrency";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import OrderForm from "./OrderForm";

const tabs = [
  { key: "pending", label: "Pending Confirmation" },
  { key: "processing", label: "Awaiting Pickup" },
  { key: "shipped", label: "In Delivery" },
  { key: "delivered", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "refunded", label: "Refunded" },
];

interface OrdersTabsProps {
  orders: MY_ORDERS_QUERYResult;
}

export default function OrdersTabs({ orders }: OrdersTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selectedOrder, setSelectedOrder] = useState<{
    orderId: string;
    productKey: string;
    productName: string;
    review?: { rating: number; comment: string; images: string[] };
  } | null>(null);

  async function updateOrderStatus(orderId: string, status: string) {
    const res = await fetch(`/api/orders/${orderId}/update-status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      throw new Error("Failed to update order status");
    }

    return res.json();
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "cancelled");
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    }
  };

  const handleRequestRefund = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "refunded");
      alert("Refund requested successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to request refund");
    }
  };

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab.key
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          No orders in this category.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-mono">{order.orderNumber}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="space-y-3">
                {order.products?.map((product) => {
                  const review = product.review
                    ? {
                        rating: product.review.rating ?? 0,
                        comment: product.review.comment ?? "",
                        images:
                          product.review.images
                            ?.map((img) =>
                              img?.asset?._ref
                                ? imageUrl({
                                    _type: "image",
                                    asset: { _ref: img.asset._ref },
                                  }).url()
                                : ""
                            )
                            .filter(Boolean) ?? [],
                      }
                    : undefined;

                  return (
                    <div
                      key={product._key}
                      className="flex flex-col border p-3 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {product.product?.image && (
                            <Image
                              src={imageUrl(product.product.image).url()}
                              alt={product.product?.name ?? ""}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">
                              {product.product?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {product.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <p className="font-semibold">
                            {formatCurrency(
                              (product.product?.price ?? 0) *
                                (product.quantity ?? 0),
                              order.currency
                            )}
                          </p>

                          {/* Chỉ cho hủy khi pending */}
                          {activeTab === "pending" && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                            >
                              Cancel Order
                            </button>
                          )}

                          {/* Chỉ cho refund khi delivered */}
                          {activeTab === "delivered" && (
                            <>
                              <button
                                onClick={() =>
                                  setSelectedOrder({
                                    orderId: order._id,
                                    productKey: product._key ?? "",
                                    productName: product.product?.name ?? "",
                                    review,
                                  })
                                }
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                              >
                                {review ? "Update Review" : "Leave Feedback"}
                              </button>

                              <button
                                onClick={() => handleRequestRefund(order._id)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                              >
                                Request Refund
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Show review if exists */}
                      {review && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <p className="font-medium">Your Review:</p>
                          <p>⭐ {review.rating} / 5</p>
                          <p className="text-gray-700">{review.comment}</p>
                          {review.images.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {review.images.map((img, idx) => (
                                <Image
                                  key={idx}
                                  src={img}
                                  alt="review image"
                                  width={60}
                                  height={60}
                                  className="rounded object-cover"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold">
                  Total:{" "}
                  {formatCurrency(order.totalPrice ?? 0, order.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedOrder && (
        <OrderForm
          orderId={selectedOrder.orderId}
          productKey={selectedOrder.productKey}
          productName={selectedOrder.productName}
          review={selectedOrder.review}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
