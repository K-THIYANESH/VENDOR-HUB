import { create } from 'zustand';
import api from '../services/api';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  images: string[];
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

// Shopping Cart Store
export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/api/cart/');
      set({ items: response.data.items || [] });
    } catch (err) {
      set({ items: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  addItem: async (productId, quantity) => {
    try {
      await api.post('/api/cart/add', { productId, quantity });
      await get().fetchCart();
    } catch (err) {
      // Handled globally
    }
  },
  updateQuantity: async (productId, quantity) => {
    try {
      await api.put('/api/cart/update', { productId, quantity });
      // Optimistic update
      set((state) => ({
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        ),
      }));
    } catch (err) {
      await get().fetchCart();
    }
  },
  removeItem: async (productId) => {
    try {
      await api.delete(`/api/cart/remove/${productId}`);
      // Optimistic state pull
      set((state) => ({
        items: state.items.filter((item) => item.productId !== productId),
      }));
    } catch (err) {
      await get().fetchCart();
    }
  },
  clearCart: async () => {
    try {
      await api.delete('/api/cart/clear');
      set({ items: [] });
    } catch (err) {
      await get().fetchCart();
    }
  },
}));
