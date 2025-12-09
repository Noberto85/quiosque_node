import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { CategoryFilter } from '@/components/features/CategoryFilter';
import { MenuItemCard } from '@/components/features/MenuItemCard';
import { CartDrawer } from '@/components/features/CartDrawer';
import { MenuItemResponse, MenuItem } from '@/types';
import { quiosqueStorage } from '@/lib/quiosque-storage';
import { menuItemService } from '@/lib/menu-service';

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);

  const filteredItems = selectedCategory
    ? items.filter((item) => item.categoria === selectedCategory)
    : items;

  useEffect(() => {
    const claim = quiosqueStorage.getClaim();
    const quiosqueId = claim?.quiosque_id ?? '';
    if (!quiosqueId) return;
    menuItemService
      .getMenuListItem(quiosqueId, selectedCategory || 'LANCHE')
      .then((resp: MenuItemResponse) => {
        if (Array.isArray(resp?.content) && resp.content.length > 0) {
          setItems(resp.content);
        }
      })
      .catch(() => {
       
      });
  }, [selectedCategory]);


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gradient">Nosso Cardápio</h1>
          <p className="text-muted-foreground">
            Escolha seus pratos favoritos e faça seu pedido
          </p>
        </div>

        <div className="mb-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center rounded-lg border p-8 text-center">
              <p className="text-lg font-medium">Nenhum item encontrado</p>
              <p className="text-sm text-muted-foreground">Tente outra categoria</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))
          )}
        </div>
      </main>

      <CartDrawer />
    </div>
  );
}
