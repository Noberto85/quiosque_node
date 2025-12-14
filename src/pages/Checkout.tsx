import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/stores/cart';
import { useAuthCliente } from '@/stores/auth';
import { ordersStorage } from '@/lib/orders-storage';
import { orderService } from '@/lib/order-service';
import { quiosqueStorage } from '@/lib/quiosque-storage';
import { formatCurrencyBRL } from '@/lib/utils';
import { toast } from 'sonner';
import { CreditCard, Wallet, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuthCliente();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [cpfPix, setCpfPix] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      if (paymentMethod === 'pix' && !cpfPix.trim()) {
        toast.error('Informe o CPF para pagamento via PIX');
        setLoading(false);
        return;
      }
      if (
        paymentMethod === 'credit' &&
        (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim())
      ) {
        toast.error('Informe todos os dados do cartão');
        setLoading(false);
        return;
      }
      const total = getTotal() + 5;
      const ctx = quiosqueStorage.getDataQuiosque();
      await orderService.createOrder({
        quiosqueId: String(ctx?.quiosqueId ?? ''),
        mesa: Number(ctx?.mesa ?? 0),
        cliente: { nome: user.username, telefone: user.telefone },
        address,
        items: items.map((i) => ({ id: i.id, nome: i.nome, quantidade: i.quantidade, preco: i.preco })),
        payment: {
          method: paymentMethod as any,
          pixCpf: paymentMethod === 'pix' ? cpfPix : undefined,
          card:
            paymentMethod === 'credit'
              ? { number: cardNumber, name: cardName, expiry: cardExpiry, cvv: cardCvv }
              : undefined,
        },
        total,
      });

      const now = new Date().toISOString();
      ordersStorage.add({
        id: String(Date.now()),
        user_id: user.telefone,
        items,
        total,
        address,
        payment_method: paymentMethod,
        status: 'pending',
        created_at: now,
        updated_at: now,
      });
      clearCart();
      toast.success('Pedido realizado com sucesso! Tempo estimado: 30-40 minutos');
      navigate('/orders');
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error('Erro ao criar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Carrinho Vazio</h2>
          <p className="mb-8 text-muted-foreground">
            Adicione itens ao carrinho antes de finalizar o pedido
          </p>
          <Button onClick={() => navigate('/menu')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Cardápio
          </Button>
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

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Finalizar Pedido</CardTitle>
                <CardDescription>
                  Preencha os dados para confirmar seu pedido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço de Entrega</Label>
                    <Input
                      id="address"
                      placeholder="Rua, número, complemento, bairro"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Método de Pagamento</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex flex-1 cursor-pointer items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Cartão de Crédito</p>
                        <p className="text-sm text-muted-foreground">Pagamento na entrega</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex flex-1 cursor-pointer items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Dinheiro</p>
                        <p className="text-sm text-muted-foreground">Pagamento na entrega</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="flex flex-1 cursor-pointer items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">PIX</p>
                        <p className="text-sm text-muted-foreground">Pagamento online</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === 'pix' && (
                <div className="space-y-2">
                  <Label htmlFor="cpf-pix">CPF</Label>
                  <Input
                    id="cpf-pix"
                    placeholder="000.000.000-00"
                    value={cpfPix}
                    onChange={(e) => setCpfPix(e.target.value)}
                    required
                  />
                </div>
              )}

              {paymentMethod === 'credit' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="card-number">Número do Cartão</Label>
                    <Input
                      id="card-number"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="card-name">Nome no Cartão</Label>
                    <Input
                      id="card-name"
                      placeholder="Como está no cartão"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-expiry">Validade (MM/AA)</Label>
                    <Input
                      id="card-expiry"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-cvv">CVV</Label>
                    <Input
                      id="card-cvv"
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

                  <Button
                    type="submit"
                    className="w-full gradient-primary"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Processando...' : 'Confirmar Pedido'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.nome}</p>
                      <p className="text-muted-foreground">
                        {item.quantidade}x {formatCurrencyBRL(item.preco)}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrencyBRL(item.preco * item.quantidade)}
                    </p>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrencyBRL(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de Entrega</span>
                    <span>{formatCurrencyBRL(5)}</span>
                  </div>
                  <div className="mt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrencyBRL(getTotal() + 5)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
