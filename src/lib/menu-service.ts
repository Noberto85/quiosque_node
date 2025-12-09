import { MenuItemResponse } from "@/types";
import { quiosqueStorage } from "./quiosque-storage";

export type QrAuthContext = {
  token: string;
  mesa?: string | number;
  quiosque?: string;
  garcom?: string;
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

class MenuItemService {
  async getAuthContext(token: string): Promise<QrAuthContext> {
    const res = await fetch(
      `http://localhost:8081/api/v1/auth?token=${encodeURIComponent(token)}`
    );
    if (!res.ok) throw new Error('Erro ao obter dados do QRCode');
    return res.json();
  }
  async getClientToken(cliente: QrAuthClient): Promise<QrAuthToken> {
    const res = await fetch('http://localhost:8081/api/v1/cliente', {
      method: 'POST',
      body: JSON.stringify(cliente),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) throw new Error('Erro ao obter token');
    return res.json();
  }

  async getMenuListItem(quiosqueId: string, categoria: string): Promise<MenuItemResponse> {
    const params = new URLSearchParams({
      page: "0",
      size: "10",
      orderBy: "nome",
      categoria: categoria
    });

    const token = quiosqueStorage.getToken();
    const res = await fetch(
      `http://localhost:8081/api/v1/cardapio/${quiosqueId}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "accept": "*/*",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      }
    );

    if (!res.ok) throw new Error("Erro ao obter dados do QRCode");
    return res.json();
  }
}

export const menuItemService = new MenuItemService();
