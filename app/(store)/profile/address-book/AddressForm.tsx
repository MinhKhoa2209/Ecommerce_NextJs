"use client";

import { useState, useEffect } from "react";
import type { Address } from "./AddressList";
import AddressSelector from "./AddressSelector";

type Props = {
  initialAddress?: Address;
  onSave: (addr: Address) => void;
  onCancel?: () => void;
  saving?: boolean;
};

export default function AddressForm({ initialAddress, onSave, onCancel, saving }: Props) {
  const [fullName, setFullName] = useState(initialAddress?.fullName || "");
  const [phone, setPhone] = useState(initialAddress?.phone || "");
  const [line1, setLine1] = useState(initialAddress?.line1 || "");
  const [line2, setLine2] = useState(initialAddress?.line2 || "");
  
  // Chúng ta dùng 3 trường này thay cho city, state, postalCode cũ
  const [province, setProvince] = useState(initialAddress?.city || "");  // bạn có thể map city = province hoặc tạo trường riêng trong Address
  const [district, setDistrict] = useState(initialAddress?.state || "");
  const [ward, setWard] = useState(initialAddress?.postalCode || "");    // nếu postalCode không phù hợp bạn có thể để string rỗng

  const [country, setCountry] = useState(initialAddress?.country || "Vietnam");
  const [isDefault, setIsDefault] = useState<boolean>(!!initialAddress?.isDefault);

  useEffect(() => {
    setFullName(initialAddress?.fullName || "");
    setPhone(initialAddress?.phone || "");
    setLine1(initialAddress?.line1 || "");
    setLine2(initialAddress?.line2 || "");
    setProvince(initialAddress?.city || "");
    setDistrict(initialAddress?.state || "");
    setWard(initialAddress?.postalCode || "");
    setCountry(initialAddress?.country || "Vietnam");
    setIsDefault(!!initialAddress?.isDefault);
  }, [initialAddress]);

  // Hàm nhận giá trị từ AddressSelector
  const handleAddressChange = (addr: { province: string; district: string; ward: string }) => {
    setProvince(addr.province);
    setDistrict(addr.district);
    setWard(addr.ward);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Kiểm tra bắt buộc:
    if (!fullName || !phone || !line1 || !province || !district || !ward) {
      alert("Please fill at least: name, phone, address line 1, province, district, ward.");
      return;
    }

    const addr: Address = {
      id: initialAddress?.id || crypto.randomUUID(),
      fullName,
      phone,
      line1,
      line2,
      city: province,      // lưu province vào city
      state: district,     // lưu district vào state
      postalCode: ward,    // lưu ward vào postalCode
      country,
      isDefault,
    };

    onSave(addr);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          className="border rounded px-3 py-2"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone number"
          className="border rounded px-3 py-2"
        />
      </div>

      <input
        value={line1}
        onChange={(e) => setLine1(e.target.value)}
        placeholder="Address line 1"
        className="border rounded px-3 py-2 w-full"
      />
      <input
        value={line2}
        onChange={(e) => setLine2(e.target.value)}
        placeholder="Address line 2 (optional)"
        className="border rounded px-3 py-2 w-full"
      />

      {/* AddressSelector thay cho city, state, postalCode */}
      <AddressSelector
        onChange={handleAddressChange}
        defaultValue={{ province, district, ward }}
      />

      <input
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Country"
        className="border rounded px-3 py-2 w-full"
      />

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        <span>Set as default address</span>
      </label>

      <div className="flex gap-2">
        <button type="button" onClick={handleSubmit} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => onCancel?.()} className="border px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
