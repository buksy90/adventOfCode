import { readFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { draw, findBases, parseMap, scoreTrailheads, solveAllTrails, solveTrail, solveTrailTracing } from './10';

describe.skip('10', () => {

  describe('part one', () => {
    test('answer', async () => {
      const input = await readFile(join(__dirname, '10.txt'), { encoding: 'utf8' });
      const map = parseMap(input);
      const trails = findBases(map);

      solveAllTrails(trails, map);
      const score = scoreTrailheads(trails);
      expect(score).to.equal(674);
    });
  });

  describe('part two', () => {
    test('answer', async () => {
      const input = await readFile(join(__dirname, '10.txt'), { encoding: 'utf8' });
      const map = parseMap(input);
      const trails = findBases(map);

      const uniqueTrails = trails.map(t => solveTrailTracing(t, map));
      //const visualization = uniqueTrails.map(trail => trail.map(t => draw(t, [8,8])));
      const score = uniqueTrails.reduce((acc, v) => acc + v.length, 0);
      
      expect(score).to.equal(1372);
    });
  });

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

    test('solveTrail2', () => {
      const input = `...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`;
      const map = parseMap(input);
      const trails = findBases(map);
      expect(trails.length).to.equal(1);

      solveTrail(trails[0], map);
      expect(trails[0].trailheads.size).to.equal(2);
      expect(trails[0].trailheads).to.have.deep.members([[0,6], [6,6]]);
    });

    test('solveTrail2', () => {
      const input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
      const map = parseMap(input);
      const trails = findBases(map);

      solveAllTrails(trails, map);
      const score = scoreTrailheads(trails);
      expect(score).to.equal(36);
    });

    test('solveTrailTracing', () => {
      const input = `.....0.
..4321.
..5..2.
..6543.
..7..4.
..8765.
..9....`;
      const map = parseMap(input);
      const trails = findBases(map);

      const uniqueTrails = solveTrailTracing(trails[0], map);
      
      expect(uniqueTrails.length).to.equal(3);
    });

    test('solveTrailTracing2', () => {
      const input = `..90..9
...1.98
...2..7
6543456
765.987
876....
987....`;
      const map = parseMap(input);
      const trails = findBases(map);

      const uniqueTrails = solveTrailTracing(trails[0], map);
      
      expect(uniqueTrails.length).to.equal(13);
    });

    test('solveTrailTracing3', () => {
      const input = `012345
123456
234567
345678
4.6789
56789.`;
      const map = parseMap(input);
      const trails = findBases(map);

      const uniqueTrails = solveTrailTracing(trails[0], map);
      
      expect(uniqueTrails.length).to.equal(227);
    });

    test('solveTrailTracing3', () => {
      const input = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
      const map = parseMap(input);
      const trails = findBases(map);

      const uniqueTrails = trails.map(t => solveTrailTracing(t, map));
      const visualization = uniqueTrails.map(trail => trail.map(t => draw(t, [8,8])));
      expect(uniqueTrails.map(t => t.length)).to.have.members([20, 24, 10, 4, 1, 4, 5, 8, 5])
      const score = uniqueTrails.reduce((acc, v) => acc + v.length, 0);
      
      expect(score).to.equal(81);
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