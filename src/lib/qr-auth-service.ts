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

export type JwtClaimsBase = {
  sub?: string;
  iat?: number;
  exp?: number;
};

export type QrAuthJwtClaims<
  T extends Record<string, any> = {
    nome?: string;
    mesa?: number;
    quiosque_id?: string;
    Roles?: string[];
  }
> = JwtClaimsBase & T;


class QrAuthService {
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
}

export const qrAuthService = new QrAuthService();
