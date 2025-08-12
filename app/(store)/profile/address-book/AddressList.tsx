"use client";

import React from "react";

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
};

type Props = {
  addresses: Address[];
  onEdit: (a: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
};

export default function AddressList({ addresses, onEdit, onDelete, onSetDefault }: Props) {
  if (!addresses || addresses.length === 0) {
    return <div className="text-gray-500">No addresses yet.</div>;
  }

  return (
    <>
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="border rounded p-4 flex flex-col h-full min-h-[220px] shadow-sm"
        >
          {/* Nội dung địa chỉ */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{addr.fullName}</p>
              {addr.isDefault && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{addr.phone}</p>
            <p className="mt-1">
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ""}
            </p>
            <p className="text-sm text-gray-600">
              {addr.city}
              {addr.state ? `, ${addr.state}` : ""}
              {addr.postalCode ? `, ${addr.postalCode}` : ""}
            </p>
            <p className="text-sm text-gray-600">{addr.country}</p>
          </div>

          {/* Nút chức năng đẩy xuống dưới cùng */}
          <div className="mt-auto flex gap-2 pt-4 border-t">
            {!addr.isDefault && (
              <button
                onClick={() => onSetDefault(addr.id)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              >
                Set Default
              </button>
            )}
            <button
              onClick={() => onEdit(addr)}
              className="text-sm bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(addr.id)}
              className="text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
