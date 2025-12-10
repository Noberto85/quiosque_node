
import { AuthCliente, AuthUser } from '@/types';


class AuthService {
  
  mapCliente(telefone: string, username: string): AuthCliente {
    return {

      telefone: telefone || '',
      username: username || '',
    };
  }
}

export const authService = new AuthService();
