import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { Game as GameType } from 'phaser';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Layout } from '@/components/layout';
import { useChips } from '@/contexts/chips';
import { PointsType } from '@/game/scenes/game';

import { authOptions } from './api/auth/[...nextauth]';

export default function Play() {
  const { chips, setChips } = useChips();
  const [game, setGame] = useState<GameType>();
  const [points, setPoints] = useState<PointsType>();
  const isPlayable = useRef(chips >= 5000).current;

  const handlePhaser = (event: Event) => {
    if (event instanceof CustomEvent) {
      const { detail } = event;

      const points = detail.points as PointsType;
      const win = detail.win as boolean;

      if (points.some((p) => p !== null)) {
        setChips((prev) => prev - 5000);
      }
      if (win) {
        setChips((prev) => prev + 10000);
      }

      setPoints([...points]);
    }
  };

  useEffect(() => {
    async function initPhaser() {
      const Phaser = await import('phaser');
      const gameConfig = await import('../game/phaserGame');
      const phaserGame = new Phaser.Game(gameConfig.config);

      setGame(phaserGame);
    }
    if (isPlayable) initPhaser();

    window.addEventListener('phaser', handlePhaser);
    return () => {
      window.removeEventListener('phaser', handlePhaser);
      game?.destroy(true);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout
      ignoreStyle
      className="my-4 flex h-[calc(100dvh-4rem)] w-full max-w-full items-center justify-center md:px-6"
    >
      <div id="game-container" className="relative">
        {!isPlayable && (
          <span className="text-2xl text-red-600">You do not have enough balance</span>
        )}
        {isPlayable && !game && <div className="text-3xl">Loading...</div>}
        {game && points && (
          <div className="absolute left-1 top-1 flex space-x-0.5 self-start md:left-2 md:top-2 md:space-x-1">
            {points.map((p, i) => (
              <span
                key={i}
                className={twMerge(
                  'h-4 w-4 rounded-full border border-solid border-white/80 md:h-6 md:w-6 lg:h-10 lg:w-10',
                  p === true && 'bg-green-600/80',
                  p === false && 'bg-red-600/80',
                  p === null && 'bg-neutral-500/80',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: authOptions.pages?.signIn || '/api/auth/signin',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
