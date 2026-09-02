import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT, getHighScore, saveHighScore } from '../utils/helpers';
import { getSettings, THEMES } from '../utils/settings';
import { soundManager } from '../utils/audio';
import { recordScore, getLeaderboard } from '../utils/leaderboard';

interface GameOverData {
  score: number;
  reason: string;
}

export class GameOverScene extends Phaser.Scene {
  private finalScore: number = 0;
  private isNewHighScore: boolean = false;
  private reasonStr: string = 'Collision';

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameOverData): void {
    this.finalScore = data?.score || 0;
    this.reasonStr = data?.reason || 'Collision';

    const settings = getSettings();
    const oldHighScore = getHighScore();
    const newHighScore = saveHighScore(this.finalScore);

    this.isNewHighScore = this.finalScore > oldHighScore && this.finalScore > 0;
    recordScore(this.finalScore, settings.difficulty);
  }

  create(): void {
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const settings = getSettings();
    const theme = THEMES[settings.theme] || THEMES.cyber;

    this.cameras.main.setBackgroundColor('#1c0d12');

    // Background overlay grid lines
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x4a1a24, 0.4);
    for (let x = 0; x <= CANVAS_WIDTH; x += 20) {
      graphics.lineBetween(x, 0, x, CANVAS_HEIGHT);
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += 20) {
      graphics.lineBetween(0, y, CANVAS_WIDTH, y);
    }

    // GAME OVER Heading
    this.add.text(centerX, centerY - 110, 'GAME OVER', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '40px',
      color: '#ff3355',
      stroke: '#440011',
      strokeThickness: 6
    }).setOrigin(0.5);

    // Reason subtitle
    this.add.text(centerX, centerY - 65, `Cause: ${this.reasonStr}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '13px',
      color: '#aa7788'
    }).setOrigin(0.5);

    // Final Score Display
    this.add.text(centerX, centerY - 30, `FINAL SCORE: ${this.finalScore}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);

    if (this.isNewHighScore) {
      const badge = this.add.text(centerX, centerY + 5, '🎉 NEW HIGH SCORE RECORD! 🎉', {
        fontFamily: 'system-ui, Arial, sans-serif',
        fontSize: '13px',
        color: '#00ff88',
        backgroundColor: '#00ff8822',
        padding: { x: 12, y: 6 }
      }).setOrigin(0.5);

      this.tweens.add({
        targets: badge,
        scale: 1.08,
        duration: 400,
        yoyo: true,
        repeat: -1
      });
    } else {
      const highScoreVal = getHighScore();
      this.add.text(centerX, centerY + 5, `BEST SCORE: ${highScoreVal}`, {
        fontFamily: 'system-ui, Arial, sans-serif',
        fontSize: '15px',
        color: '#ffcc00'
      }).setOrigin(0.5);
    }

    // Leaderboard Summary (Top 3)
    const leaderboard = getLeaderboard();
    if (leaderboard.length > 0) {
      let lbText = '🏆 TOP PLAYERS:\n';
      leaderboard.slice(0, 3).forEach((entry, idx) => {
        lbText += `#${idx + 1}  Score: ${entry.score}  (${entry.difficulty.toUpperCase()})\n`;
      });

      this.add.text(centerX, centerY + 60, lbText, {
        fontFamily: 'system-ui, Arial, sans-serif',
        fontSize: '11px',
        color: '#8888aa',
        align: 'center'
      }).setOrigin(0.5);
    }

    // Play Again Button
    const restartBtn = this.add.text(centerX, centerY + 120, 'PLAY AGAIN (SPACE)', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '15px',
      color: '#ffffff',
      backgroundColor: '#ff335544',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: restartBtn,
      alpha: 0.6,
      duration: 700,
      yoyo: true,
      repeat: -1
    });

    const restartGame = () => {
      soundManager.playClickSound();
      this.scene.start('GameScene');
    };

    restartBtn.on('pointerdown', restartGame);

    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-SPACE', restartGame);
      this.input.keyboard.once('keydown-ENTER', restartGame);
      this.input.keyboard.once('keydown-R', restartGame);
    }
  }
}
