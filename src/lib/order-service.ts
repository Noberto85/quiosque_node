import { httpJson } from '@/lib/http';
import { quiosqueStorage } from '@/lib/quiosque-storage';
import { API_BASE_URL } from '@/lib/env';

export type OrderItemPayload = {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
};

export type PaymentPayload = {
  method: 'credit' | 'cash' | 'pix';
  pixCpf?: string;
  card?: {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
  };
};

export type CreateOrderPayload = {
  quiosqueId: string;
  mesa: number;
  cliente: { nome: string; telefone: string };
  address: string;
  items: OrderItemPayload[];
  payment: PaymentPayload;
  total: number;
};

class OrderService {
  async createOrder(payload: CreateOrderPayload) {
    const token = quiosqueStorage.getToken();
    return httpJson(`${API_BASE_URL}/api/v1/pedido`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  }
}

export const orderService = new OrderService();
