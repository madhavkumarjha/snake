import { describe, it, expect, beforeEach } from 'vitest';
import { Snake } from '../src/entities/Snake';
import { DIRECTIONS, Position } from '../src/utils/helpers';

describe('Snake Entity Unit Tests', () => {
  let snake: Snake;

  beforeEach(() => {
    // Standard initialization: Head at (10, 10), length 3, facing RIGHT
    snake = new Snake({ x: 10, y: 10 }, 3, DIRECTIONS.RIGHT);
  });

  describe('Initialization', () => {
    it('initializes head position correctly', () => {
      expect(snake.getHead()).toEqual({ x: 10, y: 10 });
    });

    it('initializes body segments extending backwards from direction', () => {
      const body = snake.getBody();
      expect(body.length).toBe(3);
      expect(body[0]).toEqual({ x: 10, y: 10 }); // Head
      expect(body[1]).toEqual({ x: 9, y: 10 });  // Segment 1
      expect(body[2]).toEqual({ x: 8, y: 10 });  // Tail
    });

    it('initializes with default direction', () => {
      expect(snake.getDirection()).toEqual(DIRECTIONS.RIGHT);
    });
  });

  describe('Movement Logic', () => {
    it('advances head and shifts body segments on move()', () => {
      const newHead = snake.move();
      expect(newHead).toEqual({ x: 11, y: 10 });
      expect(snake.getHead()).toEqual({ x: 11, y: 10 });
      expect(snake.getBody()).toEqual([
        { x: 11, y: 10 },
        { x: 10, y: 10 },
        { x: 9, y: 10 }
      ]);
    });

    it('changes direction correctly when valid', () => {
      const valid = snake.setDirection(DIRECTIONS.DOWN);
      expect(valid).toBe(true);
      snake.move();
      expect(snake.getHead()).toEqual({ x: 10, y: 11 });
    });

    it('rejects 180-degree turn attempt (e.g. LEFT while moving RIGHT)', () => {
      const result = snake.setDirection(DIRECTIONS.LEFT);
      expect(result).toBe(false);
      snake.move();
      // Should continue moving RIGHT
      expect(snake.getHead()).toEqual({ x: 11, y: 10 });
    });

    it('rejects 180-degree turn relative to queued nextDirection', () => {
      snake.setDirection(DIRECTIONS.DOWN);
      // While DOWN is queued, attempting UP should fail
      const result = snake.setDirection(DIRECTIONS.UP);
      expect(result).toBe(false);
    });
  });

  describe('Growth Mechanics', () => {
    it('increases body length by 1 after grow() and move()', () => {
      const initialLength = snake.getBody().length;
      snake.grow();
      snake.move();
      const newBody = snake.getBody();
      expect(newBody.length).toBe(initialLength + 1);
      expect(newBody[newBody.length - 1]).toEqual({ x: 8, y: 10 }); // Tail preserved
    });
  });

  describe('Collision Detection', () => {
    it('detects right wall collision when head reaches grid boundary', () => {
      const wallSnake = new Snake({ x: 19, y: 10 }, 3, DIRECTIONS.RIGHT);
      expect(wallSnake.checkWallCollision(20)).toBe(false);
      wallSnake.move(); // Head moves to x: 20
      expect(wallSnake.checkWallCollision(20)).toBe(true);
    });

    it('detects top wall collision', () => {
      const wallSnake = new Snake({ x: 10, y: 0 }, 3, DIRECTIONS.UP);
      expect(wallSnake.checkWallCollision(20)).toBe(false);
      wallSnake.move(); // Head moves to y: -1
      expect(wallSnake.checkWallCollision(20)).toBe(true);
    });

    it('detects self collision when snake runs into its body', () => {
      // Create a snake with length 5
      const longSnake = new Snake({ x: 10, y: 10 }, 5, DIRECTIONS.RIGHT);
      expect(longSnake.checkSelfCollision()).toBe(false);

      // Loop snake around to collide with itself: DOWN -> LEFT -> UP
      longSnake.setDirection(DIRECTIONS.DOWN);
      longSnake.move(); // Head: (10, 11)
      longSnake.setDirection(DIRECTIONS.LEFT);
      longSnake.move(); // Head: (9, 11)
      longSnake.setDirection(DIRECTIONS.UP);
      longSnake.move(); // Head: (9, 10), which collides with body segment at (9, 10)!

      expect(longSnake.checkSelfCollision()).toBe(true);
    });
  });
});
