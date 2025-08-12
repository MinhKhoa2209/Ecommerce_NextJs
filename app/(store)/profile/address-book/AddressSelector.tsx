"use client";

import { useState, useEffect } from "react";

interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

interface Props {
  onChange: (address: { province: string; district: string; ward: string }) => void;
  defaultValue?: {
    province?: string;
    district?: string;
    ward?: string;
  };
}

export default function AddressSelector({ onChange, defaultValue }: Props) {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>(defaultValue?.province || "");
  const [selectedDistrict, setSelectedDistrict] = useState<string>(defaultValue?.district || "");
  const [selectedWard, setSelectedWard] = useState<string>(defaultValue?.ward || "");

  // Load provinces
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Error loading provinces", err));
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setSelectedDistrict("");
      return;
    }
    const province = provinces.find((p) => p.name === selectedProvince);
    if (!province) return;

    fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts || []))
      .catch((err) => console.error("Error loading districts", err));
  }, [selectedProvince, provinces]);

  // Load wards when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard("");
      return;
    }
    const district = districts.find((d) => d.name === selectedDistrict);
    if (!district) return;

    fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`)
      .then((res) => res.json())
      .then((data) => setWards(data.wards || []))
      .catch((err) => console.error("Error loading wards", err));
  }, [selectedDistrict, districts]);

  // Call onChange when selection changes
  useEffect(() => {
    onChange({
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
    });
  }, [selectedProvince, selectedDistrict, selectedWard, onChange]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Province */}
      <select
        value={selectedProvince}
        onChange={(e) => setSelectedProvince(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="">Select Province</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      {/* District */}
      <select
        value={selectedDistrict}
        onChange={(e) => setSelectedDistrict(e.target.value)}
        disabled={!selectedProvince}
        className="border rounded px-3 py-2"
      >
        <option value="">Select District</option>
        {districts.map((d) => (
          <option key={d.code} value={d.name}>
            {d.name}
          </option>
        ))}
      </select>

      {/* Ward */}
      <select
        value={selectedWard}
        onChange={(e) => setSelectedWard(e.target.value)}
        disabled={!selectedDistrict}
        className="border rounded px-3 py-2"
      >
        <option value="">Select Ward</option>
        {wards.map((w) => (
          <option key={w.code} value={w.name}>
            {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}
