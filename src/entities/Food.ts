import { Position, getRandomGridPosition, GRID_SIZE } from '../utils/helpers';

export type PreyType = 'frog' | 'bug' | 'egg' | 'gecko';

export class Food {
  private position: Position;
  private preyType: PreyType = 'frog';

  constructor(gridSize: number = GRID_SIZE, occupiedPositions: Position[] = []) {
    this.position = getRandomGridPosition(gridSize, occupiedPositions);
    this.preyType = this.getRandomPreyType();
  }

  private getRandomPreyType(): PreyType {
    const rand = Math.random();
    if (rand < 0.50) return 'frog';   // 50% Green Tree Frog
    if (rand < 0.75) return 'bug';    // 25% Forest Bug
    if (rand < 0.90) return 'egg';    // 15% Bird Egg
    return 'gecko';                    // 10% Golden Gecko (Rare)
  }

  public getPosition(): Position {
    return { ...this.position };
  }

  public getType(): PreyType {
    return this.preyType;
  }

  public getPoints(): number {
    switch (this.preyType) {
      case 'frog': return 1;
      case 'bug': return 2;
      case 'egg': return 3;
      case 'gecko': return 5;
      default: return 1;
    }
  }

  public spawn(gridSize: number = GRID_SIZE, occupiedPositions: Position[] = []): Position {
    this.position = getRandomGridPosition(gridSize, occupiedPositions);
    this.preyType = this.getRandomPreyType();
    return this.getPosition();
  }
}
