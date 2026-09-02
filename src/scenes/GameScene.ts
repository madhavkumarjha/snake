import Phaser from 'phaser';
import { Snake } from '../entities/Snake';
import { Food } from '../entities/Food';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DIRECTIONS,
  isSamePosition,
  Position
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
    this.isPaused = !this.isPaused;
    this.pauseText.setVisible(this.isPaused);
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

    // 3. Check Food Collision
    const head = this.snake.getHead();
    const foodPos = this.food.getPosition();

    if (isSamePosition(head, foodPos)) {
      const isGolden = this.food.getType() === 'golden';
      const points = this.food.getPoints();

      this.snake.grow();
      this.score += points;
      this.notifyScoreUpdate();

      soundManager.playEatSound(isGolden);
      this.spawnEatParticles(foodPos.x, foodPos.y, isGolden);
      this.spawnFloatingScore(foodPos.x, foodPos.y, points);

      this.food.spawn(this.gridSize, this.snake.getBody());
    }
  }

  private spawnEatParticles(cellX: number, cellY: number, isGolden: boolean): void {
    const px = cellX * this.cellSize + this.cellSize / 2;
    const py = cellY * this.cellSize + this.cellSize / 2;
    const color = isGolden ? 0xffcc00 : 0xff0055;

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
    const colorStr = points > 1 ? '#ffcc00' : '#00ff88';

    const textObj = this.add.text(px, py, `+${points}`, {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: points > 1 ? '22px' : '18px',
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

    // 1. Draw Grid Arena Lines
    this.graphics.lineStyle(1, theme.gridLines, theme.gridAlpha);
    for (let x = 0; x <= CANVAS_WIDTH; x += this.cellSize) {
      this.graphics.lineBetween(x, 0, x, CANVAS_HEIGHT);
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += this.cellSize) {
      this.graphics.lineBetween(0, y, CANVAS_WIDTH, y);
    }

    // Arena Outer Glowing Border
    this.graphics.lineStyle(3, theme.gridLines, 0.4);
    this.graphics.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Draw Realistic Food
    const foodPos = this.food.getPosition();
    const foodType = this.food.getType();
    const foodCenterX = foodPos.x * this.cellSize + this.cellSize / 2;
    const foodCenterY = foodPos.y * this.cellSize + this.cellSize / 2;
    const radius = (this.cellSize / 2) - 2;

    if (foodType === 'golden') {
      // Golden Apple Aura & Star Sparkles
      this.graphics.fillStyle(theme.foodGlow, 0.35);
      this.graphics.fillCircle(foodCenterX, foodCenterY, radius + 4);

      // Gold Body
      this.graphics.fillStyle(0xffcc00, 1.0);
      this.graphics.fillCircle(foodCenterX, foodCenterY, radius);

      // Shiny specular highlight
      this.graphics.fillStyle(0xffffff, 0.8);
      this.graphics.fillCircle(foodCenterX - radius * 0.35, foodCenterY - radius * 0.35, radius * 0.3);

      // Stem & Leaf
      this.graphics.lineStyle(2, 0x8b5a2b, 1.0);
      this.graphics.lineBetween(foodCenterX, foodCenterY - radius, foodCenterX + 2, foodCenterY - radius - 4);
      this.graphics.fillStyle(0x00ff88, 1.0);
      this.graphics.fillCircle(foodCenterX + 4, foodCenterY - radius - 3, 2);
    } else {
      // Normal Apple Aura
      this.graphics.fillStyle(theme.foodGlow, 0.25);
      this.graphics.fillCircle(foodCenterX, foodCenterY, radius + 3);

      // Apple Body
      this.graphics.fillStyle(theme.foodBody, 1.0);
      this.graphics.fillCircle(foodCenterX, foodCenterY, radius);

      // Specular highlight
      this.graphics.fillStyle(0xffffff, 0.7);
      this.graphics.fillCircle(foodCenterX - radius * 0.35, foodCenterY - radius * 0.35, radius * 0.25);

      // Green Leaf
      this.graphics.fillStyle(0x4caf50, 1.0);
      this.graphics.fillCircle(foodCenterX + 3, foodCenterY - radius - 2, 2.5);
    }

    // 3. Draw Interpolated Snake Segments (Silky 60 FPS Crawling)
    const body = this.snake.getBody();
    const prevBody = this.snake.getPreviousBody();
    const snakeLength = body.length;

    // Draw Body Segments backwards to layer head on top
    for (let i = snakeLength - 1; i >= 0; i--) {
      const curr = body[i];
      const prev = prevBody[i] || curr;

      // Lerp position sub-cell
      const interpX = (prev.x + (curr.x - prev.x) * progress) * this.cellSize;
      const interpY = (prev.y + (curr.y - prev.y) * progress) * this.cellSize;

      const segCenterX = interpX + this.cellSize / 2;
      const segCenterY = interpY + this.cellSize / 2;

      if (i === 0) {
        // --- SNAKE HEAD ---
        const dir = this.snake.getDirection();

        // Head Capsule Body
        this.graphics.fillStyle(theme.snakeHead, 1.0);
        this.graphics.fillRoundedRect(interpX + 1, interpY + 1, this.cellSize - 2, this.cellSize - 2, 6);

        // Directional Eye Orientation
        const eyeOffset = 4;
        const eyeRadius = Math.max(2, this.cellSize / 8);
        let leftEyeX = segCenterX - eyeOffset;
        let leftEyeY = segCenterY - eyeOffset;
        let rightEyeX = segCenterX + eyeOffset;
        let rightEyeY = segCenterY - eyeOffset;

        if (dir.x === 1) { // Right
          leftEyeX = segCenterX + eyeOffset;
          leftEyeY = segCenterY - eyeOffset;
          rightEyeX = segCenterX + eyeOffset;
          rightEyeY = segCenterY + eyeOffset;
        } else if (dir.x === -1) { // Left
          leftEyeX = segCenterX - eyeOffset;
          leftEyeY = segCenterY - eyeOffset;
          rightEyeX = segCenterX - eyeOffset;
          rightEyeY = segCenterY + eyeOffset;
        } else if (dir.y === 1) { // Down
          leftEyeX = segCenterX - eyeOffset;
          leftEyeY = segCenterY + eyeOffset;
          rightEyeX = segCenterX + eyeOffset;
          rightEyeY = segCenterY + eyeOffset;
        }

        // White of Eyes
        this.graphics.fillStyle(0xffffff, 1.0);
        this.graphics.fillCircle(leftEyeX, leftEyeY, eyeRadius);
        this.graphics.fillCircle(rightEyeX, rightEyeY, eyeRadius);

        // Black Pupil Pupil
        this.graphics.fillStyle(0x000000, 1.0);
        this.graphics.fillCircle(leftEyeX + dir.x, leftEyeY + dir.y, eyeRadius * 0.5);
        this.graphics.fillCircle(rightEyeX + dir.x, rightEyeY + dir.y, eyeRadius * 0.5);

        // Animated Flickering Tongue
        if (Math.sin(this.tongueTimer * 0.015) > 0.4) {
          this.graphics.lineStyle(2, 0xff0055, 1.0);
          const tongueLen = 7;
          const tx = segCenterX + dir.x * (this.cellSize / 2);
          const ty = segCenterY + dir.y * (this.cellSize / 2);
          this.graphics.lineBetween(tx, ty, tx + dir.x * tongueLen, ty + dir.y * tongueLen);
        }
      } else {
        // --- SNAKE BODY ---
        const alpha = Math.max(0.5, 1 - (i / snakeLength) * 0.45);
        const scaleRadius = Math.max(2, (this.cellSize / 2) - (i * 0.2));

        this.graphics.fillStyle(theme.snakeBody, alpha);
        this.graphics.fillCircle(segCenterX, segCenterY, scaleRadius);

        // Inner shine gradient circle
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

    // Camera Impact Screen Shake on Collision ("Reality Feeling")
    this.cameras.main.shake(300, 0.02);

    this.time.delayedCall(400, () => {
      this.scene.start('GameOverScene', { score: this.score, reason });
    });
  }
}
