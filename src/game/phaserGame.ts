import Phaser from 'phaser';

import { GameScene } from './scenes/game';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  canvasStyle: 'max-width: 100%; height: auto;',
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    width: 1360,
    height: 640,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: isDevelopment,
    },
  },
  scene: [GameScene],
};
