import { Product } from "@/sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BasketItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  // --- BASKET ---
  items: BasketItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
  removeItemsFromBasket: (itemsToRemove: BasketItem[]) => void; 
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => BasketItem[];

  // --- WISHLIST ---
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorite: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // --- BASKET ---
      items: [],
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { product, quantity: 1 }],
            };
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as BasketItem[]),
        })),

      clearBasket: () => set({ items: [] }),

      // Hàm xóa các sản phẩm đã mua với số lượng tương ứng
      removeItemsFromBasket: (itemsToRemove) =>
        set((state) => {
          let updatedItems = [...state.items];

          itemsToRemove.forEach((removeItem) => {
            const index = updatedItems.findIndex(
              (item) => item.product._id === removeItem.product._id
            );

            if (index !== -1) {
              const currentQuantity = updatedItems[index].quantity;
              const removeQuantity = removeItem.quantity;

              if (currentQuantity > removeQuantity) {
                // Giảm số lượng tương ứng
                updatedItems[index] = {
                  ...updatedItems[index],
                  quantity: currentQuantity - removeQuantity,
                };
              } else {
                // Xóa hoàn toàn sản phẩm khỏi giỏ
                updatedItems.splice(index, 1);
              }
            }
          });

          return { items: updatedItems };
        }),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        ),

      getItemCount: (productId) => {
        const item = get().items.find(
          (item) => item.product._id === productId
        );
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,

      // --- WISHLIST ---
      favoriteProduct: [],
      addToFavorite: async (product) => {
        const exists = get().favoriteProduct.find((p) => p._id === product._id);
        if (exists) {
          // Remove if already favorite
          set((state) => ({
            favoriteProduct: state.favoriteProduct.filter(
              (p) => p._id !== product._id
            ),
          }));
        } else {
          // Add to favorites
          set((state) => ({
            favoriteProduct: [...state.favoriteProduct, product],
          }));
        }
      },

      removeFromFavorite: (productId) =>
        set((state) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (p) => p._id !== productId
          ),
        })),

      isFavorite: (productId) => {
        return get().favoriteProduct.some((p) => p._id === productId);
      },

      clearFavorite: () => set({ favoriteProduct: [] }),
    }),
    {
      name: "store", // Dữ liệu lưu localStorage key "store"
    }
  )
);

export default useStore;
