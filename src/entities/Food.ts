import { Position, getRandomGridPosition, GRID_SIZE } from '../utils/helpers';

export class Food {
  private position: Position;

  constructor(gridSize: number = GRID_SIZE, occupiedPositions: Position[] = []) {
    this.position = getRandomGridPosition(gridSize, occupiedPositions);
  }

  public getPosition(): Position {
    return { ...this.position };
  }

  public spawn(gridSize: number = GRID_SIZE, occupiedPositions: Position[] = []): Position {
    this.position = getRandomGridPosition(gridSize, occupiedPositions);
    return this.getPosition();
  }
}
