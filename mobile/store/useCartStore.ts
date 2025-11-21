import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number; // ⬅️ ADD THIS - Available stock from product
  imgUrl?: string;
  restaurantId: string;
  restaurantName: string;
  restaurantDeliveryTime?: string;
  restaurantDeliveryFee?: number;
  description?: string;
  categoryId?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  restaurantDeliveryTime: string | null;
  restaurantDeliveryFee: number | null;

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
      restaurantDeliveryTime: null,
      restaurantDeliveryFee: null,

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
            restaurantDeliveryTime: item.restaurantDeliveryTime,
            restaurantDeliveryFee: item.restaurantDeliveryFee,
          });
          return;
        }

        // Check if item already exists
        const existingItem = state.items.find((i) => i.id === item.id);

        if (existingItem) {
          // Check stock before updating quantity
          const newQuantity = existingItem.quantity + (item.quantity || 1);

          if (newQuantity > item.stock) {
            Alert.alert(
              "Stock Limit Reached",
              `Only ${item.stock} items available in stock. You already have ${existingItem.quantity} in cart.`
            );
            return;
          }

          // Update quantity
          set({
            items: state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: newQuantity, stock: item.stock }
                : i
            ),
          });
        } else {
          // Check stock for new item
          const requestedQuantity = item.quantity || 1;

          if (requestedQuantity > item.stock) {
            Alert.alert(
              "Insufficient Stock",
              `Only ${item.stock} items available.`
            );
            return;
          }

          // Add new item
          set({
            items: [...state.items, { ...item, quantity: requestedQuantity }],
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
            restaurantDeliveryTime: item.restaurantDeliveryTime,
            restaurantDeliveryFee: item.restaurantDeliveryFee,
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
          restaurantDeliveryTime:
            newItems.length === 0 ? null : state.restaurantDeliveryTime,
          restaurantDeliveryFee:
            newItems.length === 0 ? null : state.restaurantDeliveryFee,
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const item = get().items.find((i) => i.id === itemId);
        if (!item) return;

        // Check stock limit
        if (quantity > item.stock) {
          Alert.alert(
            "Stock Limit Reached",
            `Only ${item.stock} items available in stock.`
          );
          return;
        }

        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        });
      },

      incrementQuantity: (itemId) => {
        const item = get().items.find((i) => i.id === itemId);
        if (!item) return;

        // Check if we can increment
        if (item.quantity >= item.stock) {
          Alert.alert(
            "Stock Limit Reached",
            `Only ${item.stock} items available. You have reached the maximum quantity.`
          );
          return;
        }

        set({
          items: get().items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
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
          restaurantDeliveryTime: null,
          restaurantDeliveryFee: null,
        });
      },

      clearRestaurant: () => {
        set({
          restaurantId: null,
          restaurantName: null,
          restaurantDeliveryTime: null,
          restaurantDeliveryFee: null,
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
