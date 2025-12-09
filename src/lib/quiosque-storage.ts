import type { QrAuthContext, QrAuthJwtClaims } from './qr-auth-service';
import { decodeJwt } from './qr-auth-service';

const KEY = 'quiosque_ref';
const CLAIM = 'claim';

export const quiosqueStorage = {
  setDataQuiosque(data: QrAuthContext) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch { }
  },
  setClaim(token: string) {
    try {
      const claims = decodeJwt(token);
      if (claims) {
        localStorage.setItem(CLAIM, JSON.stringify(claims));
      }
    } catch { }
  },
   getClaim(): QrAuthJwtClaims | null {
    try {
      const raw = localStorage.getItem(CLAIM);
      return raw ? JSON.parse(raw) : null;
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
    } catch { }
  },
};
