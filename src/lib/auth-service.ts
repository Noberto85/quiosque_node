
import { AuthCliente } from '@/types';


class AuthService {
  
  mapCliente(telefone: string): AuthCliente {
    return {

      telefone: telefone || '',
    };
  }
}

export const authService = new AuthService();
