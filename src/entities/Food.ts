import { Position, getRandomGridPosition, GRID_SIZE } from '../utils/helpers';

export type FoodType = 'normal' | 'golden';

export class Food {
  private position: Position;
  private type: FoodType = 'normal';

  constructor(gridSize: number = GRID_SIZE, occupiedPositions: Position[] = []) {
    this.position = getRandomGridPosition(gridSize, occupiedPositions);
    this.type = 'normal';
  }

  public getPosition(): Position {
    return { ...this.position };
  }

  public getType(): FoodType {
    return this.type;
  }

  public getPoints(): number {
    return this.type === 'golden' ? 3 : 1;
  }

  public spawn(gridSize: number = GRID_SIZE, occupiedPositions: Position[] = []): Position {
    this.position = getRandomGridPosition(gridSize, occupiedPositions);
    // 15% chance to spawn a golden apple
    this.type = Math.random() < 0.15 ? 'golden' : 'normal';
    return this.getPosition();
  }
}
