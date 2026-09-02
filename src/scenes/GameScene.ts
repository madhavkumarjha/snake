import Phaser from 'phaser';
import { Snake } from '../entities/Snake';
import { Food, PreyType } from '../entities/Food';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DIRECTIONS,
  isSamePosition
} from '../utils/helpers';
import { getSettings, THEMES, DIFFICULTY_SPEEDS } from '../utils/settings';
import { soundManager } from '../utils/audio';

interface FloatingText {
  text: Phaser.GameObjects.Text;
  startY: number;
  alpha: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: number;
  alpha: number;
  size: number;
  life: number;
}

export class GameScene extends Phaser.Scene {
  private snake!: Snake;
  private food!: Food;
  private score: number = 0;
  private isPaused: boolean = false;
  private isGameOver: boolean = false;
  private graphics!: Phaser.GameObjects.Graphics;
  private pauseText!: Phaser.GameObjects.Text;
  private lastTickTime: number = 0;
  private tickInterval: number = 200;
  private gridSize: number = 20;
  private cellSize: number = 20;
  private floatingTexts: FloatingText[] = [];
  private particles: Particle[] = [];
  private tongueTimer: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  public pauseGame(): void {
    if (this.isGameOver) return;
    this.isPaused = true;
    if (this.pauseText) this.pauseText.setVisible(true);
  }

  public resumeGame(): void {
    if (this.isGameOver) return;
    this.isPaused = false;
    if (this.pauseText) this.pauseText.setVisible(false);
  }

  public isGamePaused(): boolean {
    return this.isPaused;
  }

  create(): void {
    const settings = getSettings();
    const theme = THEMES[settings.theme] || THEMES.cyber;
    this.gridSize = settings.gridSize || 20;
    this.cellSize = CANVAS_WIDTH / this.gridSize;
    this.tickInterval = DIFFICULTY_SPEEDS[settings.difficulty] || 200;

    this.cameras.main.setBackgroundColor(theme.background);

    const startX = Math.floor(this.gridSize / 2);
    const startY = Math.floor(this.gridSize / 2);
    this.snake = new Snake({ x: startX, y: startY }, 3, DIRECTIONS.RIGHT);
    this.food = new Food(this.gridSize, this.snake.getBody());
    this.score = 0;
    this.isPaused = false;
    this.isGameOver = false;
    this.floatingTexts = [];
    this.particles = [];
    this.tongueTimer = 0;

    this.graphics = this.add.graphics();

    // Pause UI overlay text
    this.pauseText = this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PAUSED\n\n[ SPACE ] Resume | [ ESC ] Menu', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '28px',
      color: '#ffcc00',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 5,
      backgroundColor: '#000000dd',
      padding: { x: 25, y: 15 }
    }).setOrigin(0.5).setDepth(20).setVisible(false);

    this.setupInputHandlers();

    this.lastTickTime = this.time.now;
    this.notifyScoreUpdate();
  }

  private setupInputHandlers(): void {
    if (!this.input.keyboard) return;

    const cursors = this.input.keyboard.createCursorKeys();
    const keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC
    }) as Record<string, Phaser.Input.Keyboard.Key>;

    cursors.up.on('down', () => this.snake.setDirection(DIRECTIONS.UP));
    cursors.down.on('down', () => this.snake.setDirection(DIRECTIONS.DOWN));
    cursors.left.on('down', () => this.snake.setDirection(DIRECTIONS.LEFT));
    cursors.right.on('down', () => this.snake.setDirection(DIRECTIONS.RIGHT));

    keys.W.on('down', () => this.snake.setDirection(DIRECTIONS.UP));
    keys.S.on('down', () => this.snake.setDirection(DIRECTIONS.DOWN));
    keys.A.on('down', () => this.snake.setDirection(DIRECTIONS.LEFT));
    keys.D.on('down', () => this.snake.setDirection(DIRECTIONS.RIGHT));

    keys.SPACE.on('down', () => this.togglePause());
    keys.ESC.on('down', () => {
      soundManager.playClickSound();
      this.scene.start('MenuScene');
    });
  }

  private togglePause(): void {
    if (this.isGameOver) return;
    if (this.isPaused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
    soundManager.playClickSound();
  }

  update(time: number, delta: number): void {
    if (this.isPaused || this.isGameOver) return;

    this.tongueTimer += delta;

    // Check game tick step
    if (time - this.lastTickTime >= this.tickInterval) {
      this.lastTickTime = time;
      this.gameTick();
    }

    // Progress float between 0 and 1 for 60 FPS interpolated crawling motion
    const rawProgress = (time - this.lastTickTime) / this.tickInterval;
    const progress = Math.min(Math.max(rawProgress, 0), 1);

    this.updateFX(delta);
    this.render(progress);
  }

  private gameTick(): void {
    this.snake.move();

    // 1. Check Wall Collision
    if (this.snake.checkWallCollision(this.gridSize)) {
      this.triggerGameOver('Wall Collision');
      return;
    }

    // 2. Check Self Collision
    if (this.snake.checkSelfCollision()) {
      this.triggerGameOver('Self Collision');
      return;
    }

    // 3. Check Prey Swallow Collision
    const head = this.snake.getHead();
    const preyPos = this.food.getPosition();

    if (isSamePosition(head, preyPos)) {
      const preyType = this.food.getType();
      const points = this.food.getPoints();

      this.snake.grow();
      this.score += points;
      this.notifyScoreUpdate();

      soundManager.playEatSound(preyType);
      this.spawnPreyEatParticles(preyPos.x, preyPos.y, preyType);
      this.spawnFloatingScore(preyPos.x, preyPos.y, points);

      this.food.spawn(this.gridSize, this.snake.getBody());
    }
  }

  private spawnPreyEatParticles(cellX: number, cellY: number, preyType: PreyType): void {
    const px = cellX * this.cellSize + this.cellSize / 2;
    const py = cellY * this.cellSize + this.cellSize / 2;
    let color = 0x4caf50; // Frog green
    if (preyType === 'bug') color = 0xff9800;
    if (preyType === 'egg') color = 0xfff8e1;
    if (preyType === 'gecko') color = 0xffcc00;

    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 90;
      this.particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.3 ? color : 0xffffff,
        alpha: 1.0,
        size: 3 + Math.random() * 4,
        life: 0.4 + Math.random() * 0.3
      });
    }
  }

  private spawnFloatingScore(cellX: number, cellY: number, points: number): void {
    const px = cellX * this.cellSize + this.cellSize / 2;
    const py = cellY * this.cellSize + this.cellSize / 2;
    const colorStr = points >= 3 ? '#ffcc00' : '#00ff88';

    const textObj = this.add.text(px, py, `+${points}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: points >= 3 ? '22px' : '18px',
      color: colorStr,
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setDepth(15);

    this.floatingTexts.push({
      text: textObj,
      startY: py,
      alpha: 1.0
    });
  }

  private updateFX(delta: number): void {
    const dtSeconds = delta / 1000;

    // Update Floating Score Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const item = this.floatingTexts[i];
      item.text.y -= 35 * dtSeconds;
      item.alpha -= 1.8 * dtSeconds;
      item.text.setAlpha(Math.max(item.alpha, 0));

      if (item.alpha <= 0) {
        item.text.destroy();
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dtSeconds;
      p.y += p.vy * dtSeconds;
      p.life -= dtSeconds;
      p.alpha = Math.max(p.life / 0.5, 0);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  private render(progress: number): void {
    this.graphics.clear();
    const settings = getSettings();
    const theme = THEMES[settings.theme] || THEMES.cyber;

    // 1. Draw Real Natural Ground / Grassland Terrain (NO rigid box grid lines!)
    // Decorative organic grass tufts & soil dots
    this.graphics.fillStyle(theme.gridLines, 0.08);
    for (let i = 0; i < 24; i++) {
      const gx = ((i * 37) % CANVAS_WIDTH);
      const gy = ((i * 53) % CANVAS_HEIGHT);
      this.graphics.fillCircle(gx, gy, 2);
      this.graphics.fillCircle(gx + 3, gy - 2, 1.5);
    }

    // Natural Perimeter Stone/Log Border
    this.graphics.lineStyle(4, theme.gridLines, 0.5);
    this.graphics.strokeRect(2, 2, CANVAS_WIDTH - 4, CANVAS_HEIGHT - 4);

    // 2. Draw Realistic Wild Snake Prey (Frog, Bug, Egg, Gecko)
    const preyPos = this.food.getPosition();
    const preyType = this.food.getType();
    const preyCenterX = preyPos.x * this.cellSize + this.cellSize / 2;
    const preyCenterY = preyPos.y * this.cellSize + this.cellSize / 2;
    const radius = (this.cellSize / 2) - 2;

    if (preyType === 'frog') {
      // 🐸 GREEN TREE FROG
      // Body
      this.graphics.fillStyle(0x4caf50, 1.0);
      this.graphics.fillCircle(preyCenterX, preyCenterY, radius);
      // Hind leg folds
      this.graphics.fillCircle(preyCenterX - radius * 0.7, preyCenterY + radius * 0.3, radius * 0.45);
      this.graphics.fillCircle(preyCenterX + radius * 0.7, preyCenterY + radius * 0.3, radius * 0.45);
      // Bulging eyes on top
      this.graphics.fillStyle(0xffeb3b, 1.0);
      this.graphics.fillCircle(preyCenterX - radius * 0.4, preyCenterY - radius * 0.6, radius * 0.35);
      this.graphics.fillCircle(preyCenterX + radius * 0.4, preyCenterY - radius * 0.6, radius * 0.35);
      // Pupils
      this.graphics.fillStyle(0x000000, 1.0);
      this.graphics.fillCircle(preyCenterX - radius * 0.4, preyCenterY - radius * 0.6, radius * 0.18);
      this.graphics.fillCircle(preyCenterX + radius * 0.4, preyCenterY - radius * 0.6, radius * 0.18);
    } else if (preyType === 'bug') {
      // 🦗 FOREST BUG / GRASSHOPPER
      this.graphics.fillStyle(0xff9800, 1.0);
      this.graphics.fillCircle(preyCenterX, preyCenterY, radius * 0.75);
      // Antennae
      this.graphics.lineStyle(1.5, 0xffeb3b, 1.0);
      this.graphics.lineBetween(preyCenterX, preyCenterY, preyCenterX - 6, preyCenterY - 8);
      this.graphics.lineBetween(preyCenterX, preyCenterY, preyCenterX + 6, preyCenterY - 8);
    } else if (preyType === 'egg') {
      // 🥚 BIRD EGG
      this.graphics.fillStyle(0xfff8e1, 1.0);
      this.graphics.fillCircle(preyCenterX, preyCenterY, radius * 0.85);
      // Speckles
      this.graphics.fillStyle(0x8d6e63, 0.8);
      this.graphics.fillCircle(preyCenterX - 3, preyCenterY - 2, 1.5);
      this.graphics.fillCircle(preyCenterX + 2, preyCenterY + 3, 1.5);
    } else if (preyType === 'gecko') {
      // 🦎 GOLDEN GECKO / MOUSE (RARE)
      this.graphics.fillStyle(0xffcc00, 0.35);
      this.graphics.fillCircle(preyCenterX, preyCenterY, radius + 4);

      this.graphics.fillStyle(0xffaa00, 1.0);
      this.graphics.fillCircle(preyCenterX, preyCenterY, radius);

      this.graphics.fillStyle(0xffffff, 0.9);
      this.graphics.fillCircle(preyCenterX - 3, preyCenterY - 3, 2.5);
    }

    // 3. Draw Interpolated Snake Segments (Realistic Viper/Cobra Anatomy)
    const body = this.snake.getBody();
    const prevBody = this.snake.getPreviousBody();
    const snakeLength = body.length;

    // Draw Body Segments backwards to layer head on top
    for (let i = snakeLength - 1; i >= 0; i--) {
      const curr = body[i];
      const prev = prevBody[i] || curr;

      // Lerp sub-cell position
      const interpX = (prev.x + (curr.x - prev.x) * progress) * this.cellSize;
      const interpY = (prev.y + (curr.y - prev.y) * progress) * this.cellSize;

      const segCenterX = interpX + this.cellSize / 2;
      const segCenterY = interpY + this.cellSize / 2;

      if (i === 0) {
        // --- REALISTIC VIPER/COBRA HEAD ---
        const dir = this.snake.getDirection();

        // Triangular Viper Head Base
        this.graphics.fillStyle(theme.snakeHead, 1.0);
        this.graphics.fillRoundedRect(interpX + 1, interpY + 1, this.cellSize - 2, this.cellSize - 2, 7);

        // Predator Slit Eyes
        const eyeOffset = 5;
        let leftEyeX = segCenterX - eyeOffset;
        let leftEyeY = segCenterY - eyeOffset;
        let rightEyeX = segCenterX + eyeOffset;
        let rightEyeY = segCenterY - eyeOffset;

        if (dir.x === 1) { // Right
          leftEyeX = segCenterX + eyeOffset; leftEyeY = segCenterY - eyeOffset;
          rightEyeX = segCenterX + eyeOffset; rightEyeY = segCenterY + eyeOffset;
        } else if (dir.x === -1) { // Left
          leftEyeX = segCenterX - eyeOffset; leftEyeY = segCenterY - eyeOffset;
          rightEyeX = segCenterX - eyeOffset; rightEyeY = segCenterY + eyeOffset;
        } else if (dir.y === 1) { // Down
          leftEyeX = segCenterX - eyeOffset; leftEyeY = segCenterY + eyeOffset;
          rightEyeX = segCenterX + eyeOffset; rightEyeY = segCenterY + eyeOffset;
        }

        // Yellow Eye Iris
        this.graphics.fillStyle(0xffeb3b, 1.0);
        this.graphics.fillCircle(leftEyeX, leftEyeY, 3);
        this.graphics.fillCircle(rightEyeX, rightEyeY, 3);

        // Vertical Slit Predator Pupil
        this.graphics.lineStyle(1.5, 0x000000, 1.0);
        this.graphics.lineBetween(leftEyeX, leftEyeY - 2, leftEyeX, leftEyeY + 2);
        this.graphics.lineBetween(rightEyeX, rightEyeY - 2, rightEyeX, rightEyeY + 2);

        // Animated Forked Pink Tongue
        if (Math.sin(this.tongueTimer * 0.015) > 0.3) {
          this.graphics.lineStyle(2, 0xff0055, 1.0);
          const tongueLen = 8;
          const tx = segCenterX + dir.x * (this.cellSize / 2);
          const ty = segCenterY + dir.y * (this.cellSize / 2);
          this.graphics.lineBetween(tx, ty, tx + dir.x * tongueLen, ty + dir.y * tongueLen);
        }
      } else {
        // --- REALISTIC SNAKE SCALES BODY ---
        const alpha = Math.max(0.5, 1 - (i / snakeLength) * 0.45);
        const scaleRadius = Math.max(2, (this.cellSize / 2) - (i * 0.18));

        this.graphics.fillStyle(theme.snakeBody, alpha);
        this.graphics.fillCircle(segCenterX, segCenterY, scaleRadius);

        // Overlapping scale spine highlight
        this.graphics.fillStyle(0xffffff, alpha * 0.25);
        this.graphics.fillCircle(segCenterX - scaleRadius * 0.2, segCenterY - scaleRadius * 0.2, scaleRadius * 0.4);
      }
    }

    // 4. Render Particle Bursts
    this.particles.forEach(p => {
      this.graphics.fillStyle(p.color, p.alpha);
      this.graphics.fillCircle(p.x, p.y, p.size);
    });
  }

  private notifyScoreUpdate(): void {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      scoreElement.textContent = this.score.toString();
    }
  }

  private triggerGameOver(reason: string): void {
    this.isGameOver = true;
    soundManager.playGameOverSound();

    // Camera Impact Screen Shake on Collision
    this.cameras.main.shake(300, 0.02);

    this.time.delayedCall(400, () => {
      this.scene.start('GameOverScene', { score: this.score, reason });
    });
  }
}
