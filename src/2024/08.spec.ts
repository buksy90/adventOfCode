import { readFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { isDiagonal, getAntinodes, Position, TMap, recognizeSignals, getAllAntinodes, parseMap, setDistance, getAllAntinodesDistances, parseExpectedAntinodes, draw } from "./08";


describe.skip('08', () => {
  beforeEach(() => setDistance(1));

  describe('part one', () => {
    test('answer', async () => {
      const content = await readFile(join(__dirname, '08.txt'), { encoding: 'utf8' });
      const map = parseMap(content);

      const antinodes = getAllAntinodes(map);
      expect(antinodes.length).to.be.above(238, 'incorrect, too low');
      expect(antinodes.length).to.be.below(250, 'incorrect, too high');
      expect(antinodes.length).to.equal(249);
    });
  });

  describe('part two', () => {
    test('example', async () => {
      const input = `T....#....
      ...T......
      .T....#...
      .........#
      ..#.......
      ..........
      ...#......
      ..........
      ....#.....
      ..........`;
        const expectedAntinodes = parseExpectedAntinodes(input);
        const map = parseMap(input.replaceAll('#', '.'));
        const antinodes = getAllAntinodesDistances(map);
        const visuzalized = draw(antinodes, [], [map[0].length, map.length]);

        expect(antinodes.length).to.equal(9);

        expect(antinodes).to.have.deep.members([[3,1], [6, 7]]);
    });

    test('example2', async () => {
      const input = `##....#....#
.#.#....0...
..#.#0....#.
..##...0....
....0....#..
.#...#A....#
...#..#.....
#....#.#....
..#.....A...
....#....A..
.#........#.
...#......##`;
        const expectedAntinodes = parseExpectedAntinodes(input);
        const map = parseMap(input.replaceAll('#', '.'));
        const antinodes = getAllAntinodesDistances(map);
        const visuzalized = draw(antinodes, [], [map[0].length, map.length]);

        expect(antinodes.length).to.equal(34);

        expect(antinodes).to.have.deep.members([[3,1], [6, 7]]);
    });

    test.only('x3', () => {
      const a1 = getAntinodes([5,2], [4,4], [10,12], true);
      expect(a1).to.include.deep.members([[6,0], [3,6], [2,8], [1,10]]);
    });

    test('x2', () => {
      const a1 = getAntinodes([1,2], [3,1], [10,10], true);
      expect(a1).to.include.deep.members([[5,0]]);
    });

    test('x', () => {
      const a1 = getAntinodes([0,0], [1,2], [10,10], true);
      expect(a1).to.include.deep.members([[2,4], [1,2]]);

      setDistance(2);
      const a2 = getAntinodes([0,0], [1,2], [10,10], true);
      expect(a2).to.include.deep.members([[2,4], [3,6]]);

      setDistance(3);
      const a3 = getAntinodes([0,0], [1,2], [10,10], true);
      expect(a3).to.include.deep.members([[3,6], [4,8]]);
    });

    test.only('answer', async () => {
      const content = await readFile(join(__dirname, '08.txt'), { encoding: 'utf8' });
      const map = parseMap(content);

      const antinodes = getAllAntinodesDistances(map);
      expect(antinodes.length).to.be.above(161, 'tested, too low');
      expect(antinodes.length).to.be.above(501, 'tested, too low');
      expect(antinodes.length).to.equal(905);
    });
  });

  describe('helpers', () => {
    test('isDiagonal should return false for horizontal points', () => {
      const p1: Position = [0, 0];
      const p2: Position = [1, 0];
      expect(isDiagonal(p1, p2)).toBe(false);
    });

    test('isDiagonal should return false for vertical points', () => {
      const p1: Position = [0, 0];
      const p2: Position = [0, 1];
      expect(isDiagonal(p1, p2)).toBe(false);
    });

    test('isDiagonal should return the difference for diagonal points', () => {
      const p1: Position = [0, 0];
      const p2: Position = [2, 2];
      expect(isDiagonal(p1, p2)).toBe(2);
    });

    test('getAntinodes should return antinodes for horizontal points', () => {
      const p1: Position = [1, 0];
      const p2: Position = [2, 0];
      expect(getAntinodes(p1, p2, [4, 1])).to.have.deep.members([[0, 0], [3, 0]]);
    });

    test('getAntinodes should return antinodes for vertical points', () => {
      const p1: Position = [0, 1];
      const p2: Position = [0, 2];
      expect(getAntinodes(p1, p2, [1, 4])).to.have.deep.members([[0, 0], [0, 3]]);
    });

    test('getAntinodes should return antinodes for diagonal points', () => {
      const p1: Position = [1, 1];
      const p2: Position = [2, 2];
      expect(getAntinodes(p1, p2, [4 ,4])).to.have.deep.members([[0, 0], [3, 3]]);

      const p3: Position = [1, 1];
      const p4: Position = [2, 2];
      expect(getAntinodes(p3, p4, [4, 4])).to.have.deep.members([[0, 0], [3, 3]]);
    });

    describe('getAllAntinodes', () => {
      test('example 1', () => {
        const input = `..........
        ..........
        ..........
        ....a.....
        ..........
        .....a....
        ..........
        ..........
        ..........
        ..........`;
        const map = parseMap(input);
        const antinodes = getAllAntinodes(map);

        expect(antinodes).to.have.deep.members([[3,1], [6, 7]]);
      });

      test('example 2', () => {
        const input = `..........
        ..........
        ..........
        ....a.....
        ........a.
        .....a....
        ..........
        ..........
        ..........
        ..........`;
        const map = parseMap(input);
        const antinodes = getAllAntinodes(map);

        expect(antinodes).to.have.deep.members([[3,1], [6, 7], [0,2], [2, 6]]);
      });

      test('example 3', () => {
        const input = `..........
        ..........
        ..........
        ....a.....
        ........a.
        .....a....
        ..........
        ......A...
        ..........
        ..........`;
        const map = parseMap(input);
        const antinodes = getAllAntinodes(map);

        expect(antinodes).to.have.deep.members([[3,1], [0,2], [2, 6],
          // antinode covering "A" signal
          [6,7]
        ]);
      });

      test('example 4', () => {
        const input = `............
        ........0...
        .....0......
        .......0....
        ....0.......
        ......A.....
        ............
        ............
        ........A...
        .........A..
        ............
        ............`;
        const map = parseMap(input);
        const antinodes = getAllAntinodes(map);

        expect(antinodes).to.have.deep.members([
          [6,0], [11,0], [3,1], [4,2], [10,2], [2,3], [9,4],
          [1,5], [3,6], [0,7], [7,7], [10,10], [10,11],

          // When following added then implementation logic passes part 1
          [6,5]
        ]);

        expect(antinodes.length).to.equal(14);
      });
    });

    describe('recognizeSignals', () => {
      test('should return an empty map for an empty input', () => {
        const input: TMap = [];
        expect(recognizeSignals(input)).toEqual(new Map());
      });

      test('should return a map with a single signal', () => {
        const input: TMap = [['A']];
        expect(recognizeSignals(input)).toEqual(new Map([['A', [[0, 0]]]]));
      });

      test('should return a map with multiple signals', () => {
        const input: TMap = [
          ['A', 'B'],
          ['B', 'A']
        ];
        expect(recognizeSignals(input)).toEqual(new Map([
          ['A', [[0, 0], [1, 1]]],
          ['B', [[1, 0], [0, 1]]]
        ]));
      });

      test('should ignore empty signals', () => {
        const input: TMap = [
          ['A', '.'],
          ['.', 'B']
        ];
        expect(recognizeSignals(input)).toEqual(new Map([
          ['A', [[0, 0]]],
          ['B', [[1, 1]]]
        ]));
      });
    });
  });
});
