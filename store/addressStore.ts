import { Address } from "@/app/(store)/profile/address-book/AddressList";
import { create } from "zustand";

interface AddressStore {
  addresses: Address[];
  shippingAddress: Address | null;
  hasLoadedAddresses: boolean;
  setAddresses: (a: Address[]) => void;
  setShippingAddress: (a: Address | null) => void;
  setHasLoadedAddresses: (v: boolean) => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
  addresses: [],
  shippingAddress: null,
  hasLoadedAddresses: false,
  setAddresses: (a) => set({ addresses: a }),
  setShippingAddress: (a) => set({ shippingAddress: a }),
  setHasLoadedAddresses: (v) => set({ hasLoadedAddresses: v }),
}));
