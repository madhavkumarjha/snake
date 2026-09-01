import { Position, Direction, DIRECTIONS, isOppositeDirection, isSamePosition, GRID_SIZE } from '../utils/helpers';

export class Snake {
  private body: Position[];
  private direction: Direction;
  private nextDirection: Direction;
  private isGrowing: boolean = false;

  constructor(
    startPosition: Position = { x: 10, y: 10 },
    initialLength: number = 3,
    initialDirection: Direction = DIRECTIONS.RIGHT
  ) {
    this.direction = initialDirection;
    this.nextDirection = initialDirection;
    this.body = [];

    // Construct initial snake body segments extending backwards from startPosition
    for (let i = 0; i < initialLength; i++) {
      this.body.push({
        x: startPosition.x - i * initialDirection.x,
        y: startPosition.y - i * initialDirection.y
      });
    }
  }

  public getHead(): Position {
    return { ...this.body[0] };
  }

  public getBody(): Position[] {
    return this.body.map(p => ({ ...p }));
  }

  public getDirection(): Direction {
    return { ...this.direction };
  }

  public setDirection(newDirection: Direction): boolean {
    // Prevent 180-degree turn relative to active direction or queued next direction
    if (
      isOppositeDirection(newDirection, this.direction) ||
      isOppositeDirection(newDirection, this.nextDirection)
    ) {
      return false;
    }
    this.nextDirection = newDirection;
    return true;
  }

  public move(): Position {
    // Commit queued direction for this tick
    this.direction = this.nextDirection;

    const head = this.getHead();
    const newHead: Position = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y
    };

    // Add new head to front
    this.body.unshift(newHead);

    if (this.isGrowing) {
      this.isGrowing = false; // Reset grow flag, keep tail segment
    } else {
      this.body.pop(); // Remove tail segment
    }

    return newHead;
  }

  public grow(): void {
    this.isGrowing = true;
  }

  public checkWallCollision(gridSize: number = GRID_SIZE): boolean {
    const head = this.getHead();
    return (
      head.x < 0 ||
      head.x >= gridSize ||
      head.y < 0 ||
      head.y >= gridSize
    );
  }

  public checkSelfCollision(): boolean {
    const head = this.getHead();
    // Head collides with any body segment after index 0
    return this.body.slice(1).some(segment => isSamePosition(head, segment));
  }

  public reset(startPosition: Position = { x: 10, y: 10 }, initialDirection: Direction = DIRECTIONS.RIGHT): void {
    this.direction = initialDirection;
    this.nextDirection = initialDirection;
    this.isGrowing = false;
    this.body = [
      { ...startPosition },
      { x: startPosition.x - initialDirection.x, y: startPosition.y - initialDirection.y },
      { x: startPosition.x - 2 * initialDirection.x, y: startPosition.y - 2 * initialDirection.y }
    ];
  }
}
