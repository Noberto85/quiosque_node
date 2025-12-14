import { create } from 'zustand';
import { CartItem, MenuItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  
  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find((i) => i.id === item.id);
    
    if (existingItem) {
      set({
        items: items.map((i) =>
          i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i
        ),
      });
    } else {
      set({ items: [...items, { ...item, quantidade: 1 }] });
    }
  },
  
  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity === 0) {
      get().removeItem(id);
    } else {
      set({
        items: get().items.map((i) =>
          i.id === id ? { ...i, quantidade: quantity } : i
        ),
      });
    }
  },
  
  clearCart: () => set({ items: [] }),
  
  toggleCart: () => set({ isOpen: !get().isOpen }),
  
  getTotal: () => {
    return get().items.reduce((total, item) => total + item.preco * item.quantidade, 0);
  },
}));
