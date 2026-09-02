import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT, getHighScore } from '../utils/helpers';
import { getSettings, THEMES } from '../utils/settings';
import { soundManager } from '../utils/audio';
import { getLeaderboard } from '../utils/leaderboard';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const settings = getSettings();
    const theme = THEMES[settings.theme] || THEMES.cyber;

    this.cameras.main.setBackgroundColor(theme.background);

    // Dynamic grid pattern background
    const graphics = this.add.graphics();
    graphics.lineStyle(1, theme.gridLines, theme.gridAlpha);
    for (let x = 0; x <= CANVAS_WIDTH; x += 20) {
      graphics.lineBetween(x, 0, x, CANVAS_HEIGHT);
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += 20) {
      graphics.lineBetween(0, y, CANVAS_WIDTH, y);
    }

    // Outer Glow Border
    graphics.lineStyle(2, theme.gridLines, 0.3);
    graphics.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Title Logo
    this.add.text(centerX, centerY - 110, '🐍 SNAKE V2', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '42px',
      color: theme.cardBg === '#0a220a' ? '#66ff66' : '#00ff88',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(centerX, centerY - 65, 'REALISTIC ARCADE EDITION', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '13px',
      color: '#8888bb'
    }).setOrigin(0.5);

    // Active Settings Badges
    const diffText = settings.difficulty.toUpperCase();
    const themeText = settings.theme.toUpperCase();
    this.add.text(centerX, centerY - 30, `⚡ ${diffText} SPEED  •  🎨 ${themeText}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '12px',
      color: '#ffcc00',
      backgroundColor: '#00000088',
      padding: { x: 12, y: 6 }
    }).setOrigin(0.5);

    // High Score Card
    const highScore = getHighScore();
    const leaderboard = getLeaderboard();
    const topScore = leaderboard.length > 0 ? leaderboard[0].score : highScore;

    this.add.text(centerX, centerY + 15, `🏆 BEST SCORE: ${topScore}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Start Button
    const startBtn = this.add.text(centerX, centerY + 75, 'PRESS SPACE OR CLICK TO START', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '15px',
      color: '#ffffff',
      backgroundColor: '#00ff8833',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // Pulse animation
    this.tweens.add({
      targets: startBtn,
      alpha: 0.5,
      duration: 750,
      yoyo: true,
      repeat: -1
    });

    // Footer Help Controls
    this.add.text(centerX, CANVAS_HEIGHT - 30, 'Arrows / WASD: Move  |  Space: Pause  |  ⚙️ Gear: Settings', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '11px',
      color: '#666688'
    }).setOrigin(0.5);

    const startGame = () => {
      soundManager.playClickSound();
      this.scene.start('GameScene');
    };

    startBtn.on('pointerdown', startGame);

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-SPACE', startGame);
      this.input.keyboard.once('keydown-ENTER', startGame);
    }
  }
}
