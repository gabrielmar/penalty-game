import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';

import { ChipsProvider } from '@/context/chips';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>
      <Head>
        <link rel="icon" href="/favicon.svg" />
        <title>Pênalti Game</title>
      </Head>
      <SessionProvider session={session}>
        <ChipsProvider>
          <Component {...pageProps} />
        </ChipsProvider>
      </SessionProvider>
    </>
  );
}
