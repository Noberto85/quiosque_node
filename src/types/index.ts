export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface AuthCliente {
  telefone: string;
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
  codigo: string;
  user_id: string;
  mesa: number;
  itens: CartItem[];
  total: number;
  payment_method: string;
  status: string;
  dataInit: string;
  dataFim: string;
}

export interface MenuItemResponse {
  content: MenuItem[];
  totalPages: number;
  totalElements: number;
}

export interface CategoriaResponse {
  id: string;
  descricao: string;
}
