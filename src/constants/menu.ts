import { MenuItem } from '@/types';

export const MENU_ITEMS: MenuItem[] = [
  // Entradas
  {
    id: '1',
    nome: 'Bruschetta Italiana',
    descricao: 'Pão italiano tostado com tomate fresco, manjericão e azeite',
    preco: 18.90,
    categoria: 'Entradas',
    avaliacao: 4.5,
    imagem: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    nome: 'Carpaccio de Carne', 
    descricao: 'Finas fatias de filé mignon com rúcula, parmesão e alcaparras',
    preco: 32.90,
    categoria: 'Entradas',
    avaliacao: 4.2,   
    imagem: 'https://images.unsplash.com/photo-1626074353765-517a65eeef7a?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    nome: 'Camarão ao Alho',
    descricao: 'Camarões salteados no alho e ervas finas',
    preco: 42.90,
    categoria: 'Entradas',  
    imagem: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',    
  },
  
  // Pratos Principais
  {
    id: '4',
    nome: 'Filé à Parmegiana',
    descricao: 'Filé mignon empanado com molho de tomate e queijo derretido',
    preco: 58.90,
    categoria: 'Pratos Principais',
    avaliacao: 4.7,
    imagem: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    nome: 'Salmão Grelhado',
    descricao: 'Salmão grelhado com legumes e molho de maracujá',
    preco: 65.90,
    categoria: 'Pratos Principais',
    avaliacao: 4.6,
    imagem: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    nome: 'Risoto de Funghi',
    descricao: 'Risoto cremoso com mix de cogumelos frescos',
    preco: 52.90,
    categoria: 'Pratos Principais',
    avaliacao: 4.5,
    imagem: 'https://images.unsplash.com/photo-1476124369491-f117ca4b11d1?w=400&h=300&fit=crop',
  },
  {
    id: '7',
    nome: 'Picanha na Brasa',
    descricao: 'Picanha grelhada acompanhada de arroz, feijão e farofa',
    preco: 72.90,
    categoria: 'Pratos Principais',
    avaliacao: 4.4,
    imagem: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop',
  },
  
  // Bebidas
  {
    id: '8',
    nome: 'Suco Natural',   
    descricao: 'Laranja, limão, abacaxi ou morango',
    preco: 12.90,
    categoria: 'Bebidas',
    avaliacao: 4.3,
    imagem: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop',
  },
  {
    id: '9',
    nome: 'Refrigerante',   
    descricao: 'Coca-Cola, Guaraná ou Sprite - 350ml',
    preco: 8.90,
    categoria: 'Bebidas',
    avaliacao: 4.1,
    imagem: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop',
  },
  {
    id: '10',
    nome: 'Vinho Tinto',   
    descricao: 'Taça de vinho tinto selecionado',
    preco: 28.90,
    categoria: 'Bebidas',
    avaliacao: 4.4,
    imagem: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop',
  },
  
  // Sobremesas
  {
    id: '11',
    nome: 'Petit Gateau',     
    descricao: 'Bolinho de chocolate com sorvete de creme',
    preco: 24.90,
    categoria: 'Sobremesas',
    avaliacao: 4.3,
    imagem: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
  },
  {
    id: '12',
    nome: 'Tiramisù',     
    descricao: 'Sobremesa italiana com café e mascarpone',
    preco: 22.90,
    categoria: 'Sobremesas',
    avaliacao: 4.2,
    imagem: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
  },
  {
    id: '13',
    nome: 'Cheesecake de Frutas Vermelhas',     
    descricao: 'Torta cremosa com calda de frutas vermelhas',
    preco: 26.90,
    categoria: 'Sobremesas',
    avaliacao: 4.4,
    imagem: 'https://images.unsplash.com/photo-1533134242916-247a7c97b53f?w=400&h=300&fit=crop',
  },
];

export const CATEGORIES = ['Entradas', 'Pratos Principais', 'Bebidas', 'Sobremesas'];
