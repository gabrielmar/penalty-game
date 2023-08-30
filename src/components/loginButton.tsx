import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode, useContext } from 'react';

import { IconCoins } from '@/assets/icons/coins';
import { chipsContext } from '@/context/chips';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

const Button = ({ children, ...props }: ButtonProps) => (
  <button
    className="flex h-10 items-center rounded-md bg-blue-600 px-2 font-semibold md:px-6"
    {...props}
  >
    {children}
  </button>
);

export function LoginButton() {
  const { data: session } = useSession();
  const { chips: chip } = useContext(chipsContext);

  if (session) {
    return (
      <div className="flex space-x-2 md:space-x-6">
        <Link href="/buy" className="flex items-center rounded-md bg-neutral-800/60 px-2 md:px-4">
          <span className="text-xl font-semibold">{chip}</span>
          <IconCoins className="ml-3 h-6 w-6 md:ml-4" />
        </Link>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return <Button onClick={() => signIn()}>Sign in</Button>;
}
