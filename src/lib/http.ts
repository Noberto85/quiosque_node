import { toast } from 'sonner';
import { quiosqueStorage } from './quiosque-storage';

function handleErrorStatus(status: number) {
  const messages: Record<number, string> = {
    401: 'Sessão expirada. Faça login novamente.',
    403: 'Acesso negado.',
    404: 'Recurso não encontrado.',
    500: 'Erro interno do servidor.',
  };
  const message = messages[status] || 'Falha na requisição.';
  toast.error(message);
  try {
    quiosqueStorage.removeDataQuiosque();
    window.location.href = '/';
    
  } catch {}
}

export async function httpFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (!res.ok) {
    handleErrorStatus(res.status);
    throw new Error('Erro na requisição');
  }
  return res;
}

export async function httpJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await httpFetch(input, init);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

