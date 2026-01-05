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
import { orderService } from '@/lib/order-service';
import { quiosqueStorage } from '@/lib/quiosque-storage';
import { formatCurrencyBRL, formatCPF, isValidCPF, isValidName } from '@/lib/utils';
import { toast } from 'sonner';
import { CreditCard, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [loading, setLoading] = useState(false);
  const [cpfPix, setCpfPix] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [documento, setDocumento] = useState('');
  const [nome, setNome] = useState('');
  
  const ctx = quiosqueStorage.getDataQuiosque();

  const taxa = Number(quiosqueStorage.getClaim().taxa);


  const handleOrderSuccess = async () => {
    debugger
    try {
      if (!isValidName(nome)) {
        toast.error('Informe um nome válido (apenas letras)');
        return;
      }

      if (paymentMethod === 'pix') {
        if (!isValidCPF(cpfPix)) {
          toast.error('Informe um CPF válido para o PIX');
          return;
        }
      }

      if (
        paymentMethod === 'credit' &&
        (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCvv.trim() || !documento.trim() || !email.trim())
      ) {
        toast.error('Informe todos os dados do cartão e email');
        return;
      }

      if (paymentMethod === 'credit' && !isValidCPF(documento)) {
         toast.error('Informe um CPF válido para o titular do cartão');
         return;
      }

      if (!nome.trim()) {
        toast.error('Informe seu nome');
        return;
      }

      const total = getTotal() + taxa;
      
      const payload: any = {
        nome: nome.trim().toUpperCase(),
        quiosqueId: String(ctx?.quiosqueId ?? ''),
        mesa: Number(ctx?.mesa ?? 0),
        email: email.trim(),
        clienteId: ctx?.cliente,
        items: items.map((i) => ({ id: i.id, quantidade: i.quantidade })),
        pagamento: {
          metodo: paymentMethod as any,
          documento: paymentMethod === 'pix' ? cpfPix : undefined,
          email: paymentMethod === 'pix' ? email : undefined,
          cartao: paymentMethod === 'credit' ? {
             numero: cardNumber,
             nome: cardName,
             expiracao: cardExpiry,
             cvv: cardCvv,
             email,
             identification: {
               type: 'CPF',
               number: documento
             }
          } : undefined,
        },
        total,
        taxa,
      };

      const response = await orderService.createOrder(payload);

      clearCart();
      
      if (paymentMethod === 'pix') {

        const pixData = (response as any)?.payment?.pix || (response as any)?.pix || {};
        const pixCode = response.qrCode;
        const totalMount = response.valor;
        
        navigate('/payment/pix', { 
          state: { 
            idPagamento: response.id,
            expirationDate: response.dateOfExpiration,
            qrCode: pixData.qrCode || pixCode, 
            copyPasteCode: pixData.copyPasteCode || pixCode,
            totalMount 
          } 
        });
      } else {
        toast.success('Pedido realizado com sucesso! Tempo estimado: 30-40 minutos');
        navigate('/orders');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);

    if (paymentMethod === 'pix' && (!cpfPix.trim() || !email.trim())) {
      toast.error('Informe o CPF e email para pagamento via PIX');
      setLoading(false);
      return;
    }

    await handleOrderSuccess();
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
                    <Label htmlFor="address">Nome para Entrega</Label>
                    <Input
                      id="address"
                      placeholder="Seu nome:"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Método de Pagamento</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 rounded-lg border p-4 opacity-50">
                    <RadioGroupItem value="credit" id="credit" disabled />
                    <Label htmlFor="credit" className="flex flex-1 cursor-not-allowed items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Cartão de Crédito (Em breve)</p>
                      
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-pix">Email</Label>
                    <Input
                      id="email-pix"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf-pix">CPF</Label>
                    <Input
                      id="cpf-pix"
                      placeholder="000.000.000-00"
                      value={cpfPix}
                      onChange={(e) => setCpfPix(formatCPF(e.target.value))}
                      maxLength={14}
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'credit1' && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email-card">Email</Label>
                    <Input
                      id="email-card"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
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
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="card-cpf">CPF do Titular</Label>
                    <Input
                      id="card-cpf"
                      placeholder="000.000.000-00"
                      value={documento}
                      onChange={(e) => setDocumento(formatCPF(e.target.value))} 
                      maxLength={14}
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
                    <span className="text-muted-foreground">Taxa de Serviço</span>
                    <span>{formatCurrencyBRL(taxa)}</span>
                  </div>
                  <div className="mt-4 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrencyBRL(getTotal() + taxa)}
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
