import { decodeJwt } from './jwt.utils';
import type { QrAuthContext, QrAuthJwtClaims } from './qr-auth-service';


const KEY = 'quiosque_ref';
const CLAIM = 'claim';
const TOKEN = 'token';

export const quiosqueStorage = {
  setDataQuiosque(data: QrAuthContext) {
    localStorage.setItem(KEY, JSON.stringify(data));
  },
  setUpdateDataQuiosque(cliente: string) {
     const dat = localStorage.getItem(KEY);
    if (dat) {
      const quiosque = JSON.parse(dat);
      quiosque.mesa = quiosque.mesa;
      quiosque.garcom =  quiosque.garcom;
      quiosque.cliente = cliente;
      localStorage.setItem(KEY, JSON.stringify(quiosque));
    }
  },
  setClaim(token: string) {
    try {
      localStorage.setItem(TOKEN, token);
      const claims = decodeJwt(token);
      if (claims) {
        localStorage.setItem(CLAIM, JSON.stringify(claims));
      }
    } catch { }
  },
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN);
    } catch {
      return null;
    }
  },
  getClaim<T extends Record<string, any> = QrAuthJwtClaims>(): T | null {
    try {
      const raw = localStorage.getItem(CLAIM);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  getDataQuiosque(): QrAuthContext | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  removeDataQuiosque() {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(CLAIM);
      localStorage.removeItem(TOKEN);
    } catch { }
  },
};
