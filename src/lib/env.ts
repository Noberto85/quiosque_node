export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
export const APP_ENV = (import.meta.env.VITE_APP_ENV as string) || import.meta.env.MODE;
export const isDev = APP_ENV === 'development';
export const APP_NAME = (import.meta.env.VITE_APP_NAME as string) || 'App';
export const MERCADO_PAGO_PUBLIC_KEY = (import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY as string) || '';

