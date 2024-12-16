import { readFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { findAllTraces, parseMap } from "./16";


describe('16', () => {

  describe('helpers', () => {
    test('isDiagonal should return false for horizontal points', () => {
      const input = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;
      const map = parseMap(input);

      const traces = findAllTraces(map);
      expect(traces.length).to.be.above(0);
    });
  });
});
