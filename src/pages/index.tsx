import { Game as GameType } from 'phaser';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { PointsType } from '@/game/scenes/game';

export default function Play() {
  const [game, setGame] = useState<GameType>();
  const [points, setPoints] = useState<PointsType>();

  const handlePhaser = (event: Event) => {
    if (event instanceof CustomEvent) {
      const { detail } = event;

      const points = detail.points as PointsType;
      const win = detail.win as boolean;

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
    initPhaser();

    window.addEventListener('phaser', handlePhaser);
    return () => {
      window.removeEventListener('phaser', handlePhaser);
      game?.destroy(true);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="game-container" className="h-screen w-screen">
      {!game && <div className="text-3xl">Loading...</div>}
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
  );
}
