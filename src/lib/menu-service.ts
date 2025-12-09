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

export function decodeJwt(token: string): QrAuthJwtClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(payload)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

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
}

export const menuItemService = new MenuItemService();
