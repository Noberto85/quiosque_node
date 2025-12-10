import type { Order } from '@/types';

const KEY = 'orders';

export const ordersStorage = {
  add(order: Order) {
    try {
      const raw = localStorage.getItem(KEY);
      const list: Order[] = raw ? JSON.parse(raw) : [];
      list.unshift(order);
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
  },
  getAll(): Order[] {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {}
  },
};

