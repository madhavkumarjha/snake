import { describe, it, expect } from 'vitest';
import { Food } from '../src/entities/Food';
import { Position } from '../src/utils/helpers';

describe('Food Entity Unit Tests', () => {
  it('spawns within grid boundaries', () => {
    const food = new Food(20);
    const pos = food.getPosition();
    expect(pos.x).toBeGreaterThanOrEqual(0);
    expect(pos.x).toBeLessThan(20);
    expect(pos.y).toBeGreaterThanOrEqual(0);
    expect(pos.y).toBeLessThan(20);
  });

  it('spawns outside occupied snake body positions', () => {
    const occupied: Position[] = [];
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        if (!(x === 15 && y === 15)) {
          occupied.push({ x, y });
        }
      }
    }

    const food = new Food(20, occupied);
    expect(food.getPosition()).toEqual({ x: 15, y: 15 });
  });

  it('updates position when spawn() is called', () => {
    const food = new Food(20);
    const pos1 = food.getPosition();
    // Spawn avoiding pos1
    const pos2 = food.spawn(20, [pos1]);
    expect(pos2).not.toEqual(pos1);
  });

  it('returns valid wild prey type and positive points value', () => {
    const food = new Food(20);
    const type = food.getType();
    const pts = food.getPoints();

    expect(['frog', 'bug', 'egg', 'gecko']).toContain(type);
    expect(pts).toBeGreaterThanOrEqual(1);
  });
});
