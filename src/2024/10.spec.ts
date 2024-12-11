import { readFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { findBases, parseMap, solveTrail } from './10';

describe('10', () => {

  describe('helpers', () => {

    test('findBases', () => {
      const map = [
        [0,0,1],
        [1,0,0],
      ];

      expect(findBases(map).map(m => m.base)).to.deep.equal([
        [0,0], [1,0], [1,1], [2,1],
      ]);
    });

    test('solveTrail', () => {
      const input = `0123
1234
8765
9876`;
      const map = parseMap(input);
      const trails = findBases(map);
      expect(trails.length).to.equal(1);

      solveTrail(trails[0], map);
      expect(trails[0].trailheads.size).to.equal(1);
    });

    test('parseMap', () => {
      const input = `012
123`;
      const map = parseMap(input);
      expect(map).to.deep.equal([
        [0,1,2],
        [1,2,3],
      ]);
    });
  });
});