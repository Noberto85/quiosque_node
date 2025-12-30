import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatCurrencyBRL } from '@/lib/utils';

export default function PixPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCode, totalMount, copyPasteCode } = location.state || {};
  const [copied, setCopied] = useState(false);

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
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCode value={qrCode || copyPasteCode} size={200} />
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
