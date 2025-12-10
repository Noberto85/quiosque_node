import { create } from 'zustand';
import { AuthCliente, AuthUser } from '@/types';

interface   AuthStore {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  setLoading: (loading) => set({ loading }),
}));

interface   AuthClienteStore {
  user: AuthCliente | null;
  loading: boolean;
  login: (user: AuthCliente) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthCliente = create<AuthClienteStore>((set) => ({
  user: null,
  loading: true,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  setLoading: (loading) => set({ loading }),
}));
