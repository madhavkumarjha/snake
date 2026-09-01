import { describe, it, expect, beforeEach } from 'vitest';
import {
  isSamePosition,
  isOppositeDirection,
  getRandomGridPosition,
  getHighScore,
  saveHighScore,
  clearHighScoreStorage,
  DIRECTIONS,
  HIGH_SCORE_KEY
} from '../src/utils/helpers';

describe('helpers.ts Unit Tests', () => {
  beforeEach(() => {
    clearHighScoreStorage();
  });

  describe('isSamePosition', () => {
    it('returns true when coordinates are identical', () => {
      expect(isSamePosition({ x: 5, y: 10 }, { x: 5, y: 10 })).toBe(true);
    });

    it('returns false when coordinates differ', () => {
      expect(isSamePosition({ x: 5, y: 10 }, { x: 5, y: 11 })).toBe(false);
      expect(isSamePosition({ x: 4, y: 10 }, { x: 5, y: 10 })).toBe(false);
    });
  });

  describe('isOppositeDirection', () => {
    it('correctly identifies opposite direction vectors', () => {
      expect(isOppositeDirection(DIRECTIONS.UP, DIRECTIONS.DOWN)).toBe(true);
      expect(isOppositeDirection(DIRECTIONS.LEFT, DIRECTIONS.RIGHT)).toBe(true);
    });

    it('returns false for non-opposite directions', () => {
      expect(isOppositeDirection(DIRECTIONS.UP, DIRECTIONS.RIGHT)).toBe(false);
      expect(isOppositeDirection(DIRECTIONS.LEFT, DIRECTIONS.DOWN)).toBe(false);
      expect(isOppositeDirection(DIRECTIONS.UP, DIRECTIONS.UP)).toBe(false);
    });
  });

  describe('getRandomGridPosition', () => {
    it('generates a position within grid bounds (0 to 19)', () => {
      for (let i = 0; i < 50; i++) {
        const pos = getRandomGridPosition(20);
        expect(pos.x).toBeGreaterThanOrEqual(0);
        expect(pos.x).toBeLessThan(20);
        expect(pos.y).toBeGreaterThanOrEqual(0);
        expect(pos.y).toBeLessThan(20);
      }
    });

    it('avoids occupied positions when generating coordinate', () => {
      const occupied = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 }
      ];
      for (let i = 0; i < 30; i++) {
        const pos = getRandomGridPosition(2, occupied);
        // On a 2x2 grid (4 cells total), 3 are occupied, so only {x: 1, y: 1} remains
        expect(pos).toEqual({ x: 1, y: 1 });
      }
    });
  });

  describe('getHighScore & saveHighScore', () => {
    it('returns 0 when no high score is stored', () => {
      expect(getHighScore()).toBe(0);
    });

    it('saves and updates high score correctly', () => {
      const saved = saveHighScore(15);
      expect(saved).toBe(15);
      expect(getHighScore()).toBe(15);
    });

    it('does not overwrite higher score with a lower score', () => {
      saveHighScore(20);
      const res = saveHighScore(10);
      expect(res).toBe(20);
      expect(getHighScore()).toBe(20);
    });
  });
});
