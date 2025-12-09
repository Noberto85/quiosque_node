import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive">
          <AlertTriangle className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gradient">Ocorreu um erro</h1>
        <p className="mb-6 text-muted-foreground">
          Não foi possível recuperar os dados do QRCode. Tente novamente ou volte para a página inicial.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a href="/">
            <Button variant="outline">Voltar para Home</Button>
          </a>
          <a href="/login">
            <Button className="gradient-primary">Ir para Login</Button>
          </a>
        </div>
      </div>
    </div>
  );
}

