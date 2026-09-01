import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT, getHighScore, saveHighScore } from '../utils/helpers';

interface GameOverData {
  score: number;
  reason: string;
}

export class GameOverScene extends Phaser.Scene {
  private finalScore: number = 0;
  private isNewHighScore: boolean = false;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData): void {
    this.finalScore = data?.score || 0;
    const oldHighScore = getHighScore();
    const newHighScore = saveHighScore(this.finalScore);
    this.isNewHighScore = this.finalScore > oldHighScore && this.finalScore > 0;
  }

  create(): void {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    this.cameras.main.setBackgroundColor('#2a1a1e');

    // Background overlay grid lines
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x4a2a2a, 0.4);
    for (let x = 0; x < CANVAS_WIDTH; x += 20) {
      graphics.lineBetween(x, 0, x, CANVAS_HEIGHT);
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 20) {
      graphics.lineBetween(0, y, CANVAS_WIDTH, y);
    }

    // GAME OVER Heading
    this.add.text(centerX, centerY - 80, 'GAME OVER', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '42px',
      color: '#ff4444',
      stroke: '#440000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Score details
    this.add.text(centerX, centerY - 20, `FINAL SCORE: ${this.finalScore}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const highScoreVal = getHighScore();
    this.add.text(centerX, centerY + 15, `HIGH SCORE: ${highScoreVal}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '16px',
      color: '#ffcc00'
    }).setOrigin(0.5);

    if (this.isNewHighScore) {
      const badge = this.add.text(centerX, centerY + 45, '🎉 NEW HIGH SCORE! 🎉', {
        fontFamily: 'system-ui, Arial, sans-serif',
        fontSize: '14px',
        color: '#00ff88',
        backgroundColor: '#00ff8822',
        padding: { x: 10, y: 5 }
      }).setOrigin(0.5);

      this.tweens.add({
        targets: badge,
        scale: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }

    // Restart button
    const restartText = this.add.text(centerX, centerY + 95, 'PLAY AGAIN (SPACE)', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#ff444444',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: restartText,
      alpha: 0.5,
      duration: 700,
      yoyo: true,
      repeat: -1
    });

    const restartGame = () => {
      this.scene.start('GameScene');
    };

    restartText.on('pointerdown', restartGame);

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-SPACE', restartGame);
      this.input.keyboard.once('keydown-ENTER', restartGame);
      this.input.keyboard.once('keydown-R', restartGame);
    }
  }
}
