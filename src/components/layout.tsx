import { HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Header } from './header';

type LayoutProps = HTMLAttributes<HTMLDivElement> & {
  ignoreStyle?: boolean;
  className?: string;
  children?: ReactNode;
};

export function Layout({ ignoreStyle, className, children, ...props }: LayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <div
        className={twMerge(
          !ignoreStyle &&
            'mx-auto my-8 flex w-full max-w-screen-lg grow flex-col justify-center px-6 md:my-16',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
