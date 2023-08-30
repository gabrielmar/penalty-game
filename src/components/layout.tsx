import { ReactNode } from 'react';

import { Header } from './header';

type LayoutProps = {
  children?: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto my-8 flex w-full max-w-screen-lg grow flex-col justify-center px-6 md:my-16">
        {children}
      </div>
    </div>
  );
}
