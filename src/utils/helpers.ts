export interface Position {
  x: number;
  y: number;
}

export interface Direction {
  x: number;
  y: number;
}

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const CANVAS_WIDTH = GRID_SIZE * CELL_SIZE; // 400px
export const CANVAS_HEIGHT = GRID_SIZE * CELL_SIZE; // 400px

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export const HIGH_SCORE_KEY = 'snake_classic_highscore';

export function isSamePosition(p1: Position, p2: Position): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export function isOppositeDirection(d1: Direction, d2: Direction): boolean {
  return d1.x + d2.x === 0 && d1.y + d2.y === 0;
}

export function getRandomGridPosition(
  gridSize: number = GRID_SIZE,
  occupiedPositions: Position[] = []
): Position {
  const totalCells = gridSize * gridSize;
  if (occupiedPositions.length >= totalCells) {
    return { x: 0, y: 0 };
  }

  let pos: Position;
  let attempts = 0;
  const maxAttempts = 1000;

  do {
    pos = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    attempts++;
  } while (
    occupiedPositions.some(occ => isSamePosition(occ, pos)) &&
    attempts < maxAttempts
  );

  return pos;
}

let memoryStorage: Record<string, string> = {};

export function clearHighScoreStorage(): void {
  memoryStorage = {};
  try {
    if (typeof localStorage !== 'undefined' && localStorage.clear) {
      localStorage.clear();
    }
  } catch {
    // ignore
  }
}

export function getHighScore(): number {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem) {
      const val = localStorage.getItem(HIGH_SCORE_KEY);
      if (val !== null) {
        return parseInt(val, 10) || 0;
      }
    }
  } catch {
    // Fall back to memory storage
  }
  const val = memoryStorage[HIGH_SCORE_KEY];
  return val ? parseInt(val, 10) || 0 : 0;
}

export function saveHighScore(score: number): number {
  const current = getHighScore();
  if (score > current) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.setItem) {
        localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      }
    } catch {
      // Ignore storage errors in restricted envs
    }
    memoryStorage[HIGH_SCORE_KEY] = score.toString();
    return score;
  }
  return current;
}

