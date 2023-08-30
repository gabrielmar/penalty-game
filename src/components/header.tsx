import Link from 'next/link';

import { IconChip } from '@/assets/icons/logo';

import { LoginButton } from './loginButton';

export function Header() {
  return (
    <header className="sticky left-0 right-0 top-0 z-50 bg-neutral-900/70 shadow-md backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-screen-lg items-center justify-between px-4 xl:px-0">
        <Link href="/" className="flex pr-4 md:px-4">
          <IconChip className="h-10 w-10 text-white" />
        </Link>
        <LoginButton />
      </div>
    </header>
  );
}
