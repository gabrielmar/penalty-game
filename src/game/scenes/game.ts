import Phaser, { Scene } from 'phaser';

const arrayOfN = (length: number, text: string) => Array.from({ length }, (_, i) => text + i);

const randomInteger = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

type ImagesType = {
  name: string;
  x: number;
  y: number;
  object?: Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;
  frameWidth?: number;
  frameHeight?: number;
  align?: number;
  frames?: number;
  repeat?: number;
}[];

type TargetType = {
  name: string;
  target: Phaser.GameObjects.Image;
  targetCover: Phaser.GameObjects.Image;
  goalkeeper: string;
}[];

export type PointsType = (boolean | null | undefined)[];

export class GameScene extends Scene {
  constructor(
    private images: ImagesType,
    private points: PointsType,
  ) {
    super('game');

    this.points = Array.from({ length: 5 }, (_, i) => null);
    this.sendEvent({ points: this.points });

    this.images = [
      {
        name: 'flags',
        x: 0,
        y: 0,
        frameWidth: 170,
        frameHeight: 120,
      },
      {
        name: 'goal',
        x: 681.5,
        y: 165,
      },
      {
        name: 'ball_start',
        x: 735,
        y: 488,
      },
      {
        name: 'ball',
        x: 688,
        y: 475,
        frameWidth: 150,
        frameHeight: 150,
      },
      {
        name: 'player',
        x: -90,
        y: 10,
        align: Phaser.Display.Align.BOTTOM_RIGHT,
        frames: 31,
      },
      {
        name: 'gk_idle',
        x: -2,
        y: 48,
        align: Phaser.Display.Align.BOTTOM_CENTER,
        frames: 24,
        repeat: -1,
      },
      {
        name: 'gk_save_center_down',
        x: -12,
        y: 48,
        align: Phaser.Display.Align.BOTTOM_CENTER,
        frames: 51,
      },
      {
        name: 'gk_save_center_up',
        x: -12,
        y: 48,
        align: Phaser.Display.Align.BOTTOM_CENTER,
        frames: 25,
      },
      {
        name: 'gk_save_down_left',
        x: 65,
        y: 48,
        align: Phaser.Display.Align.BOTTOM_LEFT,
        frames: 34,
      },
      {
        name: 'gk_save_down_right',
        x: 43,
        y: 48,
        align: Phaser.Display.Align.BOTTOM_RIGHT,
        frames: 34,
      },
      {
        name: 'gk_save_left',
        x: 70,
        y: 48,
        align: Phaser.Display.Align.BOTTOM_LEFT,
        frames: 34,
      },
      {
        name: 'gk_save_right',
        x: 41,
        y: 48,
        align: Phaser.Display.Align.BOTTOM_RIGHT,
        frames: 34,
      },
    ];
  }

  preload() {
    this.load.audio('noise', 'audio/noise.mp3');
    this.load.audio('first', 'audio/first.mp3');
    this.load.audio('goal0', 'audio/goal0.mp3');
    this.load.audio('goal1', 'audio/goal1.mp3');
    this.load.audio('defense0', 'audio/defense0.mp3');
    this.load.audio('defense1', 'audio/defense1.mp3');

    this.load.image('background', 'images/background.jpg');
    this.load.image('target', 'images/target.png');
    this.load.image('target_cover', 'images/target_cover.png');

    this.images.forEach((value) => {
      if (value.frames && value.frames > 0) {
        arrayOfN(value.frames, value.name).forEach((img) =>
          this.load.image(img, `images/${value.name}/${img}.png`),
        );
      } else if (value.frameWidth && value.frameHeight) {
        this.load.spritesheet(value.name, `images/${value.name}.png`, {
          frameWidth: value.frameWidth,
          frameHeight: value.frameHeight,
        });
      } else {
        this.load.image(value.name, `images/${value.name}.png`);
      }
    });
  }

  create() {
    this.sound.pauseOnBlur = false;
    this.sound.add('noise').setVolume(0.15).setLoop(true).play();

    const background = this.add.image(680, 320, 'background');
    const goal = this.images.find((value) => value.name === 'goal');
    if (!goal) return;
    goal.object = this.add.image(goal.x, goal.y, 'goal');

    const targets: TargetType = [];
    const gkPositions = [
      'gk_save_down_left',
      'gk_save_left',
      'gk_save_center_up',
      'gk_save_right',
      'gk_save_down_right',
    ];
    [
      Phaser.Display.Align.LEFT_BOTTOM,
      Phaser.Display.Align.LEFT_TOP,
      Phaser.Display.Align.TOP_CENTER,
      Phaser.Display.Align.RIGHT_TOP,
      Phaser.Display.Align.RIGHT_BOTTOM,
    ].forEach((align, i) => {
      const name = i.toString();
      const targetCover = this.add.image(0, 0, 'target_cover').setScale(0.4);
      const target = this.add.image(0, 0, 'target').setScale(0.4).setName(name).setInteractive();
      if (!goal.object) return;
      Phaser.Display.Align.In.QuickSet(targetCover, goal.object, align, 0, 0);
      Phaser.Display.Align.In.Center(target, targetCover);

      this.tweens.add({
        targets: targetCover,
        scale: 0.45,
        yoyo: true,
        duration: 1000,
        ease: 'sine.inout',
        repeat: -1,
      });

      targets.push({
        name,
        target,
        targetCover: targetCover,
        goalkeeper: gkPositions[i],
      });
    });

    this.images
      .filter((value) => value.frames && value.frames > 0)
      .forEach((value) => {
        if (!value.frames) return;
        this.anims.create({
          key: value.name,
          frames: arrayOfN(value.frames, value.name).map((v) => ({ key: v })),
          repeat: value.repeat,
        });

        const sprite = this.add.sprite(0, 0, `${value.name}0`).setVisible(false);
        value.object = sprite;
        if (!goal.object || !value.align) return;
        const alignIn = value.name === 'player' ? background : goal.object;
        Phaser.Display.Align.In.QuickSet(sprite, alignIn, value.align, value.x, value.y);
      });

    const gk = this.images.find((value) => value.name === 'gk_idle');
    if (gk?.object && 'play' in gk.object) gk?.object?.setVisible(true).play('gk_idle');

    this.anims.create({
      key: 'spin',
      frames: this.anims.generateFrameNumbers('ball', {
        frames: Array.from({ length: 7 }, (_, i) => i),
      }),
      repeat: -1,
    });

    const ball = this.add.sprite(688, 475, 'ball').setScale(1.25).setAngle(55).setVisible(false);
    const ball_start = this.add.image(735, 488, 'ball_start');

    const first = this.sound.add('first').setVolume(0.2);
    first.play();
    first.once('complete', () => {
      this.input.on(
        'pointerdown',
        (_: unknown, objectsClicked: Phaser.GameObjects.GameObject[]) => {
          if (this.points.every((value) => value !== null)) return;

          const obj = objectsClicked?.[0];
          if (objectsClicked.length && 'x' in obj && 'y' in obj) {
            const text = this.add
              .text(0, 0, '', {
                fontFamily: 'Arial',
                fontSize: 140,
                color: '#ffffff',
                align: 'center',
              })
              .setShadow(2, 2, '#000000', 5, true, true);
            const catchRate = randomInteger(0, 4);
            const win = catchRate.toString() !== obj.name;
            const sound = randomInteger(0, 1);
            if (win) {
              text.setText('GOOOL!!!');
              this.sound.add(`goal${sound}`).setVolume(0.2).play();
            } else {
              text.setText('DEFESA');
              this.sound.add(`defense${sound}`).setVolume(0.2).play();
            }
            Phaser.Display.Align.In.Center(text, background, 0, -100);
            const idx = this.points.findIndex((value) => value === null);
            if (idx !== -1) this.points[idx] = win;
            const catchAnimation =
              (win
                ? gkPositions[catchRate]
                : targets.find((value) => value.name === obj.name)?.goalkeeper) || gkPositions[0];
            const grab = this.images.find((value) => value.name === catchAnimation);
            if (grab?.object && 'play' in grab.object)
              grab.object.setVisible(true).play(catchAnimation);
            gk?.object?.setVisible(false);

            ball.setVisible(true).play('spin');
            ball_start.setVisible(false);

            targets.forEach((value) => {
              value.targetCover.setVisible(false);
              value.target.setVisible(false);
            });

            const winGame = this.points.filter((p) => p === true).length > 2;
            const isEndGame = winGame || this.points.filter((p) => p === false).length > 2;

            const points = this.points;
            this.sendEvent({ points, ...(isEndGame && { win: winGame }) });

            this.tweens.add({
              targets: ball,
              x: obj.x,
              y: obj.y,
              scale: 0.3,
              duration: 600,
              ease: 'cubic.out',
              completeDelay: 300,
              onComplete(tween) {
                if (idx + 1 === points.length || isEndGame) {
                  text.setText(winGame ? 'Você ganhou!' : 'Você perdeu!');
                  Phaser.Display.Align.In.Center(text, background, 0, -100);
                  points.fill(undefined, idx + 1);
                } else {
                  text.destroy();
                }

                gk?.object?.setVisible(true);
                if (grab?.object && 'stop' in grab.object) grab.object.setVisible(false).stop();

                ball_start.setVisible(true);
                ball.setVisible(false).stop();
                tween.pause().seek();

                targets.forEach((value) => {
                  value.targetCover.setVisible(true);
                  value.target.setVisible(true);
                });
              },
            });
          }
        },
      );
    });
  }

  sendEvent(value: unknown) {
    window.dispatchEvent(new CustomEvent('phaser', { detail: value }));
  }
}
