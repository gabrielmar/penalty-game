import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { IconChip } from '@/assets/icons/logo';
import { Layout } from '@/components/layout';
import { useChips } from '@/contexts/chips';

const PRODUCTS = [
  { id: 1, name: 'Silver', amount: 1000, price: 500 },
  { id: 2, name: 'Gold', amount: 10000, price: 5000 },
  { id: 3, name: 'Diamond', amount: 20000, price: 10000 },
];

export default function Balance() {
  const { status } = useSession();
  const [isLogged, setIsLogged] = useState(false);
  const { setChips } = useChips();

  useEffect(() => {
    if (status === 'authenticated') setIsLogged(true);
    else setIsLogged(false);
  }, [status]);

  const handlePurchase = async (credit: number) => {
    if (!isLogged) return;
    setChips((prev) => prev + credit);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center space-y-8 drop-shadow-md md:flex-row md:items-stretch md:space-x-8 md:space-y-0">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="flex w-full max-w-xs flex-col items-center space-y-6 rounded-lg border border-neutral-700 px-4 py-6"
          >
            <IconChip className="h-32 w-32 text-white" />
            <span className="text-4xl font-semibold">{product.amount}</span>
            <span className="text-2xl font-semibold">R$ {product.price}</span>
            <button
              onClick={() => handlePurchase(product.amount)}
              disabled={!isLogged}
              className="h-10 w-full rounded-md bg-blue-500 font-semibold disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:opacity-40"
            >
              Get {product.name} Pack
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}
