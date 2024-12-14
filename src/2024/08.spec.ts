import { readFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { isDiagonal, getAntinodes } from "./08";

describe('08', () => {
  describe('helpers', () => {

describe('08', () => {
  describe('helpers', () => {
    it('isDiagonal should return false for horizontal points', () => {
      const p1: Position = [0, 0];
      const p2: Position = [1, 0];
      expect(isDiagonal(p1, p2)).toBe(false);
    });

    it('isDiagonal should return false for vertical points', () => {
      const p1: Position = [0, 0];
      const p2: Position = [0, 1];
      expect(isDiagonal(p1, p2)).toBe(false);
    });

    it('isDiagonal should return the difference for diagonal points', () => {
      const p1: Position = [0, 0];
      const p2: Position = [2, 2];
      expect(isDiagonal(p1, p2)).toBe(2);
    });

    it('getAntinodes should return an empty array for non-diagonal points', () => {
      const p1: Position = [0, 0];
      const p2: Position = [1, 0];
      const map: TMap = [];
      expect(getAntinodes(p1, p2, map)).toEqual([]);
    });

    it('getAntinodes should return antinodes for diagonal points', () => {
      const p1: Position = [0, 0];
      const p2: Position = [2, 2];
      const map: TMap = Array(5).fill(0).map(() => Array(5).fill(0));
      expect(getAntinodes(p1, p2, map)).toEqual([[2, 2], [0, 0]]);
    });
  });
});
  });
});