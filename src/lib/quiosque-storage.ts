import type { QrAuthContext, QrAuthJwtClaims } from './qr-auth-service';

const KEY = 'quiosque_ref';
const CLAIM = 'claim';

export const quiosqueStorage = {
  setDataQuiosque(data: QrAuthContext) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch { }
  },
  setClaim(data: QrAuthJwtClaims) {
    try {
      localStorage.setItem(CLAIM, JSON.stringify(data));
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
    } catch { }
  },
};

