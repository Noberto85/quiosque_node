import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthCliente } from '@/stores/auth';
import { Order } from '@/types';
import { ArrowLeft, Calendar, MapPin, CreditCard, Package } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrencyBRL } from '@/lib/utils';
import { orderService } from '@/lib/order-service';
import { quiosqueStorage } from '@/lib/quiosque-storage';

export default function Orders() {
  const { user } = useAuthCliente();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
  
    try {
     const quisoque = quiosqueStorage.getDataQuiosque();
      const order = await orderService.getPaymentStatus(quisoque.cliente, quisoque.quiosqueId);
      setOrders(order);
    } catch (error: any) {
      console.error('Erro ao carregar pedidos', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'|'primary' }> = {
      pending: { label: 'Pendente', variant: 'secondary' },
      preparing: { label: 'Preparando', variant: 'default' },
      delivering: { label: 'Em Entrega', variant: 'default' },
      completed: { label: 'Entregue', variant: 'primary' },
      cancelled: { label: 'Cancelado', variant: 'destructive' },
    };

    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      credit: 'Cartão de Crédito',
      cash: 'Dinheiro',
      pix: 'PIX',
    };
    return labels[method] || method;
  };

  const handlePendingPayment = async (orderId: string) => {
    try {
      const response = await orderService.getPayment(orderId);
      const pixData = (response as any)?.payment?.pix || (response as any)?.pix || {};
      const pixCode = response.qrCode;
      debugger
      navigate('/payment/pix', { 
        state: { 
          idPagamento: response.id,
          expirationDate: response.dateOfExpiration,
          qrCode: pixData.qrCode || pixCode, 
          copyPasteCode: pixData.copyPasteCode || pixCode,
          totalMount: response.valor
        } 
      });
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/menu')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Cardápio
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <p className="text-muted-foreground">
            Acompanhe o histórico de seus pedidos
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-[400px] flex-col items-center justify-center text-center">
              <Package className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">Nenhum pedido ainda</h3>
              <p className="mb-6 text-muted-foreground">
                Faça seu primeiro pedido e ele aparecerá aqui
              </p>
          <Button onClick={() => navigate('/menu')} className="gradient-primary">
            Ver Cardápio
          </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Pedido #{order.codigo}
                        <span className="hidden md:flex">
                          {getStatusBadge(order.status)}
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Data Pedido: {new Date(order.dataInit).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </CardDescription>
                      {order.dataFim && (
                        <CardDescription className="mt-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                         Data Entrega: {new Date(order.dataFim).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrencyBRL(order.total)}
                      </p>
                      <div className="mt-1 flex justify-end md:hidden">
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 font-semibold">Itens:</h4>
                      <div className="space-y-2">
                        {order.itens.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-muted-foreground">
                              {item.quantidade}x {item.descricao}
                            </span>
                            <span className="font-medium">
                              {formatCurrencyBRL(item.preco * item.quantidade)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 border-t pt-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Mesa: {order.mesa}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        {getPaymentMethodLabel(order.payment_method)}
                      </div>
                      {order.status === 'pending' && (
                        <Button 
                          className="mt-2 w-full" 
                          onClick={() => handlePendingPayment(order.id)}
                        >
                          Pagar Agora
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
