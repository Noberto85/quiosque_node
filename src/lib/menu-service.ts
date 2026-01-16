import { MenuItemResponse, CategoriaResponse, MenuItem } from "@/types";
import { quiosqueStorage } from "./quiosque-storage";

export type QrAuthContext = {
  token: string;
  mesa?: string | number;
  quiosque?: string;
  garcom?: string;
  taxa?: number;
};

export type QrAuthToken = {
  token: string;
};
export type QrAuthClient = {
  nome: string;
  telefone: string;
  quiosqueId: string;
  mesa: number;
}

export type QrAuthJwtClaims = {
  sub: string;
  nome: string;
  mesa: number;
  quiosque_id: string;
  Roles: string[];
};

import { httpJson } from '@/lib/http';
import { API_BASE_URL } from '@/lib/env';

class MenuItemService {
  async getAuthContext(token: string): Promise<QrAuthContext> {
    return httpJson(`${API_BASE_URL}/api/v1/auth?token=${encodeURIComponent(token)}`);
  }

  async getClientToken(cliente: QrAuthClient): Promise<QrAuthToken> {
    return httpJson(`${API_BASE_URL}/api/v1/cliente`, {
      method: 'POST',
      body: JSON.stringify(cliente),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getMenuListItem(quiosqueId: string, categoria: string | null): Promise<MenuItem[]> {
   
    const token = quiosqueStorage.getToken();
    const params = new URLSearchParams();
    
    if (categoria && categoria !== 'null') {
      params.append('categoria', categoria);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';

    return httpJson(`${API_BASE_URL}/api/v1/cardapio/${quiosqueId}${queryString}`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

   async getCategoria(): Promise<CategoriaResponse[]> {
    
    const token = quiosqueStorage.getToken();
    const quiosqueId = quiosqueStorage.getClaim()?.quiosque_id ?? '';
    return httpJson(`${API_BASE_URL}/api/v1/categoria/${quiosqueId}`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }
  
}

export const menuItemService = new MenuItemService();
