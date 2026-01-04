import { toast } from 'sonner';
import { quiosqueStorage } from './quiosque-storage';

function handleErrorStatus(status: number) {
  debugger
  switch (status) {
    case 401:
      toast.error('Sessão expirada. Faça login novamente.');
      try {
        quiosqueStorage.removeDataQuiosque();
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } catch { }
      break;
    case 403:
      toast.error('Acesso negado.');
      break;
    case 404:
      toast.error('Recurso não encontrado.');
      break;
    case 500:
      toast.error('Erro interno do servidor.');
      break;
    default:
      toast.error('Falha na requisição.');
      break;
  }
}

export async function httpJson<T = any>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await httpFetch(input, init);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}


export async function httpFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (!res.ok) {
    handleErrorStatus(res.status);
    throw new Error('Erro na requisição');
  }
  return res;
}


