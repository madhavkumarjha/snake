import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT, getHighScore } from '../utils/helpers';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;

    // Dark gradient background representation
    this.cameras.main.setBackgroundColor('#1a1a2e');

    // Decorative grid lines background
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x2a2a4a, 0.4);
    for (let x = 0; x < CANVAS_WIDTH; x += 20) {
      graphics.lineBetween(x, 0, x, CANVAS_HEIGHT);
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 20) {
      graphics.lineBetween(0, y, CANVAS_WIDTH, y);
    }

    // Game Title
    const title = this.add.text(centerX, centerY - 90, '🐍 SNAKE', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '40px',
      color: '#00ff88',
      stroke: '#004d26',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, centerY - 45, 'CLASSIC ARCADE EDITION', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '13px',
      color: '#8888aa',
      letterSpacing: 2
    }).setOrigin(0.5);

    // High Score Badge
    const highScore = getHighScore();
    this.add.text(centerX, centerY, `BEST SCORE: ${highScore}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '18px',
      color: '#ffcc00'
    }).setOrigin(0.5);

    // Press Start Button
    const startText = this.add.text(centerX, centerY + 65, 'PRESS SPACE OR CLICK TO START', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#00ff8822',
      padding: { x: 16, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Pulse animation for Start button
    this.tweens.add({
      targets: startText,
      alpha: 0.4,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Control tips
    this.add.text(centerX, CANVAS_HEIGHT - 35, 'Controls: ↑ ↓ ← → or W A S D | Space: Pause', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '12px',
      color: '#666688'
    }).setOrigin(0.5);

    // Event listeners for starting game
    const startGame = () => {
      this.scene.start('GameScene');
    };

    startText.on('pointerdown', startGame);

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-SPACE', startGame);
      this.input.keyboard.once('keydown-ENTER', startGame);
    }
  }
}
