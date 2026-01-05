import { MenuItemResponse, CategoriaResponse } from "@/types";
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

  async getMenuListItem(quiosqueId: string, categoria: string): Promise<MenuItemResponse> {
    const params = new URLSearchParams({
      page: "0",
      size: "10",
      orderBy: "nome"
    });

    if (categoria !== null) {
      params.append("categoria", categoria);
    }


    const token = quiosqueStorage.getToken();
    return httpJson(`${API_BASE_URL}/api/v1/cardapio/${quiosqueId}?${params.toString()}`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

   async getCategoria(): Promise<CategoriaResponse[]> {
    
   
    const token = quiosqueStorage.getToken();
    return httpJson(`${API_BASE_URL}/api/v1/categoria`, {
      method: 'GET',
      headers: {
        accept: '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }
  
}

export const menuItemService = new MenuItemService();
