import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuItem } from '@/types';
import { formatCurrencyBRL } from '@/lib/utils';
import { useCart } from '@/stores/cart';
import { toast } from 'sonner';
import imgNotFound from '@/assets/img/img-not-found.jpg';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
      
    addItem(item);
    toast.success(`${item.nome} adicionado ao carrinho!`);
  };

  if (!item) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border p-4 text-center text-muted-foreground">
        Item não encontrado
      </div>
    );
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg animate-fade-in">
      <div className="aspect-video overflow-hidden">
        <img
          src={'data:image/png;base64,' +item.imagem || imgNotFound}
          alt={item.nome}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = imgNotFound;
          }}
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{item.nome}</CardTitle>
        <CardDescription className="line-clamp-2">{item.descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-primary">
          {formatCurrencyBRL(item.preco)}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}
