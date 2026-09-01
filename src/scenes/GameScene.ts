import Phaser from 'phaser';
import { Snake } from '../entities/Snake';
import { Food } from '../entities/Food';
import {
  GRID_SIZE,
  CELL_SIZE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  DIRECTIONS,
  isSamePosition
} from '../utils/helpers';

export class GameScene extends Phaser.Scene {
  private snake!: Snake;
  private food!: Food;
  private score: number = 0;
  private isPaused: boolean = false;
  private graphics!: Phaser.GameObjects.Graphics;
  private pauseText!: Phaser.GameObjects.Text;
  private timerEvent!: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor('#1a1a2e');

    this.snake = new Snake({ x: 10, y: 10 }, 3, DIRECTIONS.RIGHT);
    this.food = new Food(GRID_SIZE, this.snake.getBody());
    this.score = 0;
    this.isPaused = false;

    this.graphics = this.add.graphics();

    // Pause UI overlay text
    this.pauseText = this.add.text(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'PAUSED', {
      fontFamily: 'system-ui, Arial, sans-serif',
      fontSize: '36px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 4,
      backgroundColor: '#000000aa',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setDepth(10).setVisible(false);

    this.setupInputHandlers();

    // Game tick timer (200ms per movement step as per PRD)
    this.timerEvent = this.time.addEvent({
      delay: 200,
      callback: this.gameTick,
      callbackScope: this,
      loop: true
    });

    this.render();
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
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE
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
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    this.pauseText.setVisible(this.isPaused);
  }

  private gameTick(): void {
    if (this.isPaused) return;

    this.snake.move();

    // 1. Check Wall Collision
    if (this.snake.checkWallCollision(GRID_SIZE)) {
      this.handleGameOver('Wall Collision');
      return;
    }

    // 2. Check Self Collision
    if (this.snake.checkSelfCollision()) {
      this.handleGameOver('Self Collision');
      return;
    }

    // 3. Check Food Collision
    const head = this.snake.getHead();
    const foodPos = this.food.getPosition();

    if (isSamePosition(head, foodPos)) {
      this.snake.grow();
      this.score += 1;
      this.notifyScoreUpdate();
      this.food.spawn(GRID_SIZE, this.snake.getBody());
    }

    this.render();
  }

  private render(): void {
    this.graphics.clear();

    // Draw Grid Lines
    this.graphics.lineStyle(1, 0x252545, 0.5);
    for (let x = 0; x <= CANVAS_WIDTH; x += CELL_SIZE) {
      this.graphics.lineBetween(x, 0, x, CANVAS_HEIGHT);
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += CELL_SIZE) {
      this.graphics.lineBetween(0, y, CANVAS_WIDTH, y);
    }

    // Draw Food (Apple red with stem)
    const foodPos = this.food.getPosition();
    const foodX = foodPos.x * CELL_SIZE;
    const foodY = foodPos.y * CELL_SIZE;

    // Glowing aura
    this.graphics.fillStyle(0xff4444, 0.3);
    this.graphics.fillCircle(foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2, CELL_SIZE / 2 + 2);
    // Food body
    this.graphics.fillStyle(0xff4444, 1.0);
    this.graphics.fillRoundedRect(foodX + 2, foodY + 2, CELL_SIZE - 4, CELL_SIZE - 4, 4);

    // Draw Snake
    const body = this.snake.getBody();

    body.forEach((segment, index) => {
      const segX = segment.x * CELL_SIZE;
      const segY = segment.y * CELL_SIZE;

      if (index === 0) {
        // Snake Head - Bright Green (#4CAF50 / #00ff88)
        this.graphics.fillStyle(0x00ff88, 1.0);
        this.graphics.fillRoundedRect(segX + 1, segY + 1, CELL_SIZE - 2, CELL_SIZE - 2, 5);

        // Eyes for detail
        this.graphics.fillStyle(0x1a1a2e, 1.0);
        this.graphics.fillCircle(segX + 6, segY + 6, 2);
        this.graphics.fillCircle(segX + 14, segY + 6, 2);
      } else {
        // Snake Body - Light Green (#8BC34A)
        const alpha = Math.max(0.6, 1 - (index / body.length) * 0.4);
        this.graphics.fillStyle(0x8bc34a, alpha);
        this.graphics.fillRoundedRect(segX + 2, segY + 2, CELL_SIZE - 4, CELL_SIZE - 4, 3);
      }
    });
  }

  private notifyScoreUpdate(): void {
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      scoreElement.textContent = this.score.toString();
    }
  }

  private handleGameOver(reason: string): void {
    if (this.timerEvent) {
      this.timerEvent.remove();
    }
    this.scene.start('GameOverScene', { score: this.score, reason });
  }
}
