import { readFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { Trace, draw, findAllTraces, parseMap, score, scoreRotation } from "./16";


describe('16', () => {

  describe('part one', () => {
    test.only('answer', async () => {
      const input = await readFile(join(__dirname, '16.txt'), { encoding: 'utf8' });
      const map = parseMap(input);

      const traces = findAllTraces(map);
      expect(traces.length).to.be.above(0);

      const visualization = traces.map(trace => draw(trace, map));
      const scores = traces.map(trace => score(trace));
      scores.sort((a,b) => a-b);
      expect(scores[0]).to.equal(0);
    });
  });

  describe('helpers', () => {
    test('example', () => {
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

      const visualization = traces.map(trace => draw(trace, map));
      const scores = traces.map(trace => score(trace));
      scores.sort((a,b) => a-b);
      expect(scores[0]).to.equal(7036);
    });

    test('example', () => {
      const input = `
      #################
      #...#...#...#..E#
      #.#.#.#.#.#.#.#.#
      #.#.#.#...#...#.#
      #.#.#.#.###.#.#.#
      #...#.#.#.....#.#
      #.#.#.#.#.#####.#
      #.#...#.#.#.....#
      #.#.#####.#.###.#
      #.#.#.......#...#
      #.#.###.#####.###
      #.#.#...#.....#.#
      #.#.#.#####.###.#
      #.#.#.........#.#
      #.#.#.#########.#
      #S#.............#
      #################`;
      const map = parseMap(input);

      const traces = findAllTraces(map);
      expect(traces.length).to.be.above(0);

      const visualization = traces.map(trace => draw(trace, map));
      const scores = traces.map(trace => score(trace));
      scores.sort((a,b) => a-b);
      expect(scores[0]).to.equal(11048);
    });

    test('score', () => {
      const trace: Trace = [
        [1,1], [2, 1], [2, 0],
      ];
      expect(score(trace)).to.equal(1002);
    });

    test('scoreRotation', () => {
      const trace: Trace = [
        [1,0], [2, 0], [2, 1],
      ];
      expect(scoreRotation(trace, 2)).to.equal(1000);
    });

    test('scoreRotation2', () => {
      const trace: Trace = [
        [1,0], [2, 0], [3, 0],
      ];
      expect(scoreRotation(trace, 2)).to.equal(0);
    });

    test('scoreRotation3', () => {
      const trace: Trace = [
        [1,1], [2, 1], [2, 0],
      ];
      expect(scoreRotation(trace, 2)).to.equal(1000);
    });
  });
});
