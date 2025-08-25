"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import AddressList, { Address } from "./AddressList";
import AddressForm from "./AddressForm";
import { Plus } from "lucide-react";
import { useAddressStore } from "@/store/addressStore";

export default function AddressBookPage() {
  const { user } = useUser();

  const {
    addresses,
    setAddresses,
    setShippingAddress,
    hasLoadedAddresses,
    setHasLoadedAddresses,
  } = useAddressStore();

  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load từ Clerk 1 lần duy nhất
  useEffect(() => {
    if (!user || hasLoadedAddresses) return;

    const stored = (user.publicMetadata?.addresses as Address[]) || [];
    const addrList = Array.isArray(stored) ? stored : [];

    setAddresses(addrList);
    setShippingAddress(addrList.find((a) => a.isDefault) || null);
    setHasLoadedAddresses(true);
  }, [user, hasLoadedAddresses, setAddresses, setShippingAddress, setHasLoadedAddresses]);

  const persistAddresses = async (next: Address[]) => {
    if (!user) return false;
    try {
      setLoading(true);
      const newPublicMeta = {
        ...(user.publicMetadata || {}),
        addresses: next,
      };

      const res = await fetch("/api/user/updateMetadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          publicMetadata: newPublicMeta,
        }),
      });

      if (!res.ok) throw new Error("Failed to update metadata");

      setAddresses(next);
      setShippingAddress(next.find((a) => a.isDefault) || null);

      return true;
    } catch (err) {
      console.error("Failed to persist addresses:", err);
      alert("Failed to save addresses. Try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (addr: Address) => {
    const id = addr.id || crypto.randomUUID();
    const next = [...addresses];
    if (addr.isDefault) next.forEach((a) => (a.isDefault = false));
    next.push({ ...addr, id });
    const ok = await persistAddresses(next);
    if (ok) setShowForm(false);
  };

  const handleUpdate = async (updated: Address) => {
    const next = addresses.map((a) => (a.id === updated.id ? updated : a));
    if (updated.isDefault) {
      next.forEach((a) => {
        if (a.id !== updated.id) a.isDefault = false;
      });
    }
    const ok = await persistAddresses(next);
    if (ok) {
      setEditing(null);
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    const next = addresses.filter((a) => a.id !== id);
    await persistAddresses(next);
  };

  const handleSetDefault = async (id: string) => {
    const next = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    await persistAddresses(next);
  };

  return (
    <div className="py-16 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📍 Address Book</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <Plus size={18} /> Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-500">No addresses yet. Add your first one above.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AddressList
            addresses={addresses}
            onEdit={(a) => {
              setEditing(a);
              setShowForm(true);
            }}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Address" : "Add Address"}
            </h2>
            <AddressForm
              initialAddress={editing ?? undefined}
              onCancel={() => {
                setEditing(null);
                setShowForm(false);
              }}
              onSave={editing ? handleUpdate : handleAdd}
              saving={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
