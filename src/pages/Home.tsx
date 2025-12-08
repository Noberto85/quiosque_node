import { UtensilsCrossed } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-6">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
          <UtensilsCrossed className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gradient">Sabor & Arte</h1>
        <p className="text-muted-foreground">
          Aponte a câmera do seu celular para o QRCode do quiosque para acessar o login.
        </p>
      </div>
    </div>
  );
}

