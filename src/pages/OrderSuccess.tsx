import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = location.state || { status: 'success' };

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
        <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
          {isSuccess ? (
            <CheckCircle className="h-12 w-12 text-green-600" />
          ) : (
            <XCircle className="h-12 w-12 text-red-600" />
          )}
        </div>
        <h2 className="mb-2 text-3xl font-bold text-foreground">
          {isSuccess ? 'Pedido Realizado com Sucesso!' : 'Pagamento Expirado'}
        </h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          {isSuccess 
            ? 'Seu pagamento foi confirmado e seu pedido já está sendo preparado. Acompanhe o status em seus pedidos.'
            : 'O tempo para pagamento do PIX expirou. Por favor, realize um novo pedido.'
          }
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate('/orders')} className="min-w-[200px]">
            Meus Pedidos
          </Button>
          <Button onClick={() => navigate('/menu')} variant="outline" className="min-w-[200px]">
            Voltar ao Cardápio
          </Button>
        </div>
      </div>
    </div>
  );
}
