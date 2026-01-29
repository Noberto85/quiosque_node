export type QrAuthContext = {
  token: string;
  mesa?: string | number;
  quiosque?: string;
  garcom?: string;
  quiosqueId: string;
  cliente?: string;
  taxa?: number;
};

export type QrAuthToken = {
  token: string;
};
export type QrAuthClient = {
  telefone: string;
  password: string;
  quiosqueId: string;
  mesa: number;
}

export type CreateClienteRequest = {
  nome: string;
  telefone: string;
  password: string;
}

export type JwtClaimsBase = {
  sub?: string;
  iat?: number;
  exp?: number;
};

export type ValidateTokenResponse = {
  ativo: boolean;
};

export type QrAuthJwtClaims<
  T extends Record<string, any> = {
    nome?: string;
    numeroMesa?: number;
    mesaId?: number;
    taxa?: number;
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
    return httpJson(`${API_BASE_URL}/api/v1/auth/cliente`, {
      method: 'POST',
      body: JSON.stringify(cliente),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createCliente(cliente: CreateClienteRequest): Promise<any> {
    return httpJson(`${API_BASE_URL}/api/v1/cliente/create`, {
      method: 'POST',
      body: JSON.stringify(cliente),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendSmsToken(id: string): Promise<any> {
    return httpJson(`${API_BASE_URL}/api/v1/auth/sms/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async validateSmsToken(id: string, token: string): Promise<ValidateTokenResponse> {
    return httpJson(`${API_BASE_URL}/api/v1/auth/sms/validate`, {
      method: 'POST',
      body: JSON.stringify({"telefone": id,"token": token }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export const qrAuthService = new QrAuthService();
