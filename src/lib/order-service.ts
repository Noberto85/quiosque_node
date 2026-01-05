import { httpJson } from '@/lib/http';
import { quiosqueStorage } from '@/lib/quiosque-storage';
import { API_BASE_URL } from '@/lib/env';

export type OrderItemPayload = {
  id: string;
  quantidade: number;
};

export type PaymentPayload = {
  metodo: 'credit' | 'cash' | 'pix';
  documento?: string;
  email?: string;
  cartao?: {
    numero?: string;
    nome?: string;
    expiracao?: string;
    cvv?: string;
    token?: string;
    issuerId?: string;
    paymentMethodId?: string;
    installments?: number;
    identification?: {
      type: string;
      number: string;
    };
    email?: string;
  };
};

export type CreateOrderPayload = {
  quiosqueId: string;
  mesa: number;
  clienteId: string;
  items: OrderItemPayload[];
  pagamento: PaymentPayload;
  total: number;
  taxa?: number;
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

  async getPaymentStatus(telefone: string, quiosque: string) {
    const token = quiosqueStorage.getToken();
    return httpJson(`${API_BASE_URL}/api/v1/pedido/findByCliente/${telefone}/${quiosque}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  async getPayment(id: string) {
    const token = quiosqueStorage.getToken();
    return httpJson(`${API_BASE_URL}/api/v1/pagamento/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }
}

export const orderService = new OrderService();
