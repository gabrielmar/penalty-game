import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import { IconRollingDices } from '@/assets/icons/dice';
import { IconChip } from '@/assets/icons/logo';
import { Layout } from '@/components/layout';

const ITEMS = [
  { id: 1, title: 'Play games', icon: IconRollingDices, href: 'play' },
  { id: 2, title: 'Buy Chips', icon: IconChip, href: 'buy', className: 'bg-blue-600' },
];

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center space-y-8 md:flex-row md:items-stretch md:justify-center md:space-x-16 md:space-y-0">
        {ITEMS.map((item) => (
          <Link
            key={item.id}
            href={`/${item.href}`}
            className={twMerge(
              'group flex w-full max-w-xs flex-col items-center space-y-8 rounded-xl border border-neutral-700 bg-fuchsia-600 px-12 py-14 drop-shadow-md md:max-w-sm',
              item.className,
            )}
          >
            <item.icon className="h-36 w-36 text-white drop-shadow-xl group-hover:animate-jump md:h-48 md:w-48" />
            <span className="text-4xl font-bold tracking-wider md:text-5xl">{item.title}</span>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
