import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imgUrl?: string;
  restaurantId: string;
  restaurantName: string;
  // Add any other product fields you need
  description?: string;
  categoryId?: string;
}
interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  clearCart: () => void;
  clearRestaurant: () => void;

  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (itemId: string) => number;
  isItemInCart: (itemId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      restaurantName: null,

      addItem: (item) => {
        const state = get();

        // Check if adding from different restaurant
        if (state.restaurantId && state.restaurantId !== item.restaurantId) {
          // Clear cart when switching restaurants
          set({
            items: [
              {
                ...item,
                quantity: item.quantity || 1,
              },
            ],
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
          });
          return;
        }

        // Check if item already exists
        const existingItem = state.items.find((i) => i.id === item.id);

        if (existingItem) {
          // Update quantity
          set({
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [...state.items, { ...item, quantity: item.quantity || 1 }],
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
          });
        }
      },

      removeItem: (itemId) => {
        const state = get();
        const newItems = state.items.filter((item) => item.id !== itemId);

        set({
          items: newItems,
          // Clear restaurant if cart is empty
          restaurantId: newItems.length === 0 ? null : state.restaurantId,
          restaurantName: newItems.length === 0 ? null : state.restaurantName,
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      incrementQuantity: (itemId) => {
        set({
          items: get().items.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        });
      },

      decrementQuantity: (itemId) => {
        const item = get().items.find((i) => i.id === itemId);
        if (!item) return;

        if (item.quantity <= 1) {
          get().removeItem(itemId);
        } else {
          set({
            items: get().items.map((i) =>
              i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
            ),
          });
        }
      },

      clearCart: () => {
        set({
          items: [],
          restaurantId: null,
          restaurantName: null,
        });
      },

      clearRestaurant: () => {
        set({
          restaurantId: null,
          restaurantName: null,
        });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemQuantity: (itemId) => {
        const item = get().items.find((i) => i.id === itemId);
        return item?.quantity || 0;
      },

      isItemInCart: (itemId) => {
        return get().items.some((item) => item.id === itemId);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
