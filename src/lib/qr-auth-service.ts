export type QrAuthContext = {
  token: string;
  mesa?: string | number;
  quiosque?: string;
  garcom?: string;
  quiosqueId: string;
  cliente?: string;
};

export type QrAuthToken = {
  token: string;
};
export type QrAuthClient = {
  telefone: string;
  quiosqueId: string;
  mesa: number;
}

export type JwtClaimsBase = {
  sub?: string;
  iat?: number;
  exp?: number;
};

export type QrAuthJwtClaims<
  T extends Record<string, any> = {
    nome?: string;
    numeroMesa?: number;
    mesaId?: number;
    quiosque_id?: string;
    Roles?: string[];
  }
> = JwtClaimsBase & T;


import { httpJson } from '@/lib/http';
import { API_BASE_URL } from '@/lib/env';

class QrAuthService {
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
}

export const qrAuthService = new QrAuthService();
