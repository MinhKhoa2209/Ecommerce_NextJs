"use client";

import React, { useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { formatCurrency } from "@/lib/formatCurrency";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import OrderForm from "./OrderForm";

const tabs = [
  { key: "pending", label: "Pending Confirmation" },
  { key: "paid", label: "Awaiting Pickup" },
  { key: "shipped", label: "In Delivery" },
  { key: "delivered", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

interface OrdersTabsProps {
  orders: MY_ORDERS_QUERYResult;
}

export default function OrdersTabs({ orders }: OrdersTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selectedOrder, setSelectedOrder] = useState<{
    orderId: string;
    productIndex: number;
    productName: string;
  } | null>(null);

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
                {order.products?.map((product, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex items-center justify-between"
                  >
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
                        <p className="font-medium">{product.product?.name}</p>
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

                      {activeTab === "delivered" && (
                        <button
                          onClick={() =>
                            setSelectedOrder({
                              orderId: order._id,
                              productIndex: index,
                              productName: product.product?.name ?? "",
                            })
                          }
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          Leave Feedback
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="font-semibold">
                  Total: {formatCurrency(order.totalPrice ?? 0, order.currency)}
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
          productIndex={selectedOrder.productIndex}
          productName={selectedOrder.productName}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
