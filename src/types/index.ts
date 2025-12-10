export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface AuthCliente {
  telefone: string;
  username: string;
}

export interface MenuItem {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
  avaliacao?: number;
}

export interface CartItem extends MenuItem {
  quantidade: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total: number;
  address: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItemResponse {
  content: MenuItem[];
  totalPages: number;
  totalElements: number;
}
