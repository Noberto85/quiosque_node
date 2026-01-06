import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Copy, CheckCircle, Clock } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { formatCurrencyBRL } from '@/lib/utils';


export default function PixPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { idPagamento, qrCode, totalMount, copyPasteCode, expirationDate } = location.state || {};
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {

    const expiryTime = expirationDate ? new Date(expirationDate).getTime() : new Date().getTime() + 30 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiryTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setExpired(true);
        setTimeLeft('EXPIRADO');
        navigate('/order-success', { state: { status: 'expired' } });
      } else {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationDate]);

  useEffect(() => {

    if (!idPagamento || expired) {
      toast.success('Pagamento expirado!');
      navigate('/order-success', { state: { status: 'success' } });
      return;
    }


    const ws = new WebSocket(`${import.meta.env.VITE_API_BASE_WS}/ws/pix`);

    ws.onopen = () => {
      console.log("Conexão WebSocket aberta");
      ws.send(JSON.stringify({ id: idPagamento }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.status === 'approved') {
        toast.success('Pagamento confirmado!');
        navigate('/order-success', { state: { status: 'success' } });
      }
    };

    ws.onerror = (error) => {
      console.error("Erro WebSocket:", error);
    };

    ws.onclose = () => {
      console.log("Conexão WebSocket fechada");
    };

  }, [idPagamento, expired, navigate]);
  

  // Fallback or validation
  if (!qrCode && !copyPasteCode) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold">Dados de pagamento não encontrados</h2>
          <Button onClick={() => navigate('/orders')}>
            Ir para Meus Pedidos
          </Button>
        </div>
      </div>
    );
  }

  const handleCopyCode = () => {
    if (copyPasteCode) {
      navigator.clipboard.writeText(copyPasteCode);
      setCopied(true);
      toast.success('Código PIX copiado!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/orders')}
          className="self-start mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ver Meus Pedidos
        </Button>

        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Pagamento via PIX</CardTitle>
            <CardDescription>
              Escaneie o QR Code ou copie o código abaixo para pagar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg shadow-sm relative">
              <QRCode
                value={qrCode || copyPasteCode}
                size={200}
                style={{ opacity: expired ? 0.2 : 1 }}
              />
              {expired && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xl transform -rotate-12 border-2 border-red-600 px-4 py-1 rounded">
                    EXPIRADO
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className={`h-4 w-4 ${expired ? 'text-red-500' : 'text-orange-500'}`} />
              <span className={expired ? 'text-red-500' : 'text-orange-500'}>
                Expira em: {timeLeft}
              </span>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrencyBRL(totalMount || 0)}
              </p>
            </div>

            <div className="w-full space-y-2">
              <p className="text-sm font-medium text-center">Pix Copia e Cola</p>
              <div className="flex gap-2">
                <code className="flex-1 rounded bg-muted p-2 text-xs font-mono break-all line-clamp-2">
                  {copyPasteCode || qrCode}
                </code>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyCode}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>O pagamento será confirmado automaticamente.</p>
              <p>Você pode acompanhar o status em "Meus Pedidos".</p>
            </div>

            <Button
              className="w-full"
              onClick={() => navigate('/orders')}
            >
              Já realizei o pagamento
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
