import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { TMap, Trace, draw, eliminateBadBranch, eliminateBadBranches, eliminateDeadBranch, eliminateDeadBranches, findAllTraces, findAllTracesImproved, getPrefilledTakenSteps, isEquallyGood, isReturningInOtherBranch, isWorse, parseMap, score, scoreRotation, writeKnownTraces } from "./16";


describe.skip('16', () => {

  describe('part one', () => {
    test.only('answer', async () => {
      const input = await readFile(join(__dirname, '16e.txt'), { encoding: 'utf8' });
      const map = parseMap(input);
      const takenSteps = await getPrefilledTakenSteps();

      const traces = findAllTracesImproved(map, takenSteps);
      expect(traces.length).to.be.above(0);

      const scores = traces.map(trace => score(trace));
      const scoredTraces: [number, Trace][] = scores.map((score, i) => [score, traces[i]]);
      scoredTraces.sort((a,b) => a[0]-b[0]);

      for(const trace of traces) {
        await writeKnownTraces(trace)
      }


      console.log({ scores: scoredTraces.map(sv => sv[0]) });
      await Promise.all(scoredTraces.filter((_, i) => i < 10).map((st, i) =>
        writeFile(
          join(__dirname, `16v${i}s${st[0]}.txt`),
          draw(st[1], map).map(r => r.join('')).join('\n'),
          { encoding: 'utf8' })
      ));

      expect(scores[0]).to.be.below(130480, 'tested, too high');
      expect(scores[0]).to.be.below(120480, 'tested, too high');
      expect(scores[0]).to.be.above(70480, 'tested, too low');
      expect(scores[0]).to.not.equal(128480, 'tested, just incorrect');
      expect(scores[0]).to.not.equal(148588, 'tested, just incorrect');
      expect(scores[0]).to.equal('?');
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

      const traces = findAllTracesImproved(map);
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

      const traces = findAllTracesImproved(map);
      expect(traces.length).to.be.above(0);

      const visualization = traces.map(trace => draw(trace, map));
      const scores = traces.map(trace => score(trace));
      scores.sort((a,b) => a-b);
      expect(scores[0]).to.equal(11048);
    });

    test('custom example', () => {
      const inputBC = `
####################################
##.........#.............#........E#
##.###.#.###.#######.#####.###.#####
#..#...#.#...#.....#...#...#.#.....#
####.#.#.#.###.###.###.#.###.#####.#
#........#.#.....#...#...#.....#...#
####.#.#.#.#.###.###.#######.###.#.#
#....#...#...#.....#.#.....#.#...#.#
####.#.#######.###.#.#.###.#.#.#####
#....#...#...#.....#.#...#...#.....#
######.#.#.#.#.###.#.#.#.###.#####.#
##.....#...#.#.#.#...#.#.#.#.....#.#
##.#########.#.#.#######.#.#.#####.#
##...#...#...#.#.........#...#.....#
####.###.#.#.#.###.#.#####.###.###.#
#....#...#.#.......#.#...#.#.#.#.#.#
######.###.#######.#.#.#.#.#.#.#.#.#
#....#...#.......#...#...#...#.#...#
##.#.###.#####.#########.###.#.###.#
#..#.........#...........#...#...#.#
##################.#####.#.#####.###
#............#.....#...#.#.#...#...#
############.#.###.#.###.#.#.#.###.#
#....#.......#.#...#.....#.#.#...#.#
##.###.#######.#.#.#####.#.#####.#.#
##.........#...#.#.........#.....#.#
##########.#.#.#.#######.###.###.#.#
##...........#.#.#.....#.....#...#.#
##.###.###.#####.#.#.#.#.#########.#
#..#.....#.#...#.#.#.#...#...#.....#
####.#.#.###.#.#.###.###.#.#.#.###.#
#............#.#.....#...#.#...#.#.#
##.#.#.#######.#####.#.#.#.#####.#.#
##...#.......#.....#.#.#.#...#...#.#
##########.#####.###.#.#.###.#.###.#
##.......#.#.....#...#.#.....#.....#
##.###.#.#.#.###.#.###.#####.#####.#
##.....#...#.#...#.#.#.#.....#...#.#
########.#.#.###.#.#.#.#####.#.#.#.#
#......#...#...#.....#......S..#.#.#
####################################`;
      const input = `
####################################
##.........#.............#........E#
##.###.#.###.#######.#####.###.#####
#..#...#.#...#.....#...#...#.#.....#
####.#.#.#.###.###.###.#.###.#######
#........#.#.....#...#...#.....#...#
####.#.#.#.#.###.###.#######.###.#.#
#....#...#...#.....#.#.....#.#...#.#
####.#.#######.###.#.#.###.#.#.#####
#....#...#...#.....#.#...#...#.....#
######.#.#.#.#.###.#.#.#.###.#####.#
##.....#...#.#.#.#...#.#.#.#.....#.#
##.#########.#.#.#######.#.#.#####.#
##...#...#...#.#.........#...#.....#
####.###.#.#.#.###.#.#####.###.###.#
#....#...#.#.......#.#...#.#.#.#.#.#
######.###.#######.#.#.#.#.#.#.#.#.#
#....#...#.......#...#...#...#.#...#
##.#.###.#####.#########.###.#.###.#
#..#.........#...........#...#...#.#
##################.#####.#.#####.###
#............#.....#...#.#.#...#...#
############.#.###.#.###.#.#.#.###.#
#....#.......#.#...#.....#.#.#...#.#
##.###.#######.#.#.#####.#.#####.#.#
##.........#...#.#.........#.....#.#
##########.#.#.#.#######.###.###.#.#
##...........#.#.#.....#.....#...#.#
##.###.###.#####.#.#.#.#.#########.#
#..#.....#.#...#.#.#.#...#...#.....#
####.#.#.###.#.#.###.###.#.#.#.###.#
#............#.#.....#...#.#...#.#.#
##.#.#.#######.#####.#.#.#.#####.#.#
##...#.......#.....#.#.#.#...#...#.#
##########.#####.###.#.#.###.#.###.#
##.......#.#.....#...#.#.....#.....#
##.###.#.#.#.###.#.###.#####.#####.#
##.....#...#.#...#.#.#.#.....#...#.#
########.#.#.###.#.#.#.#######.#.#.#
#......#...#...#.....#......S..#.#.#
####################################`;
      const map = parseMap(input);

      const traces = findAllTracesImproved(map);
      expect(traces.length).to.be.above(0);

      const visualization = traces.map(trace => draw(trace, map));
      const scores = traces.map(trace => score(trace));
      scores.sort((a,b) => a-b);
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

    test('isReturningInOtherBranch', () => {
      const returningTrace: Trace[] = [
        [[1,0], [2,0], [3,0], [4,0]],
        [[3,2], [3,1], [3,0], [2,0]],
      ];
      expect(isReturningInOtherBranch(returningTrace[1], returningTrace)).to.be.true;

      const parallelTrace: Trace[] = [
        [[1,0], [2,0], [3,0], [4,0]],
        [[4,3], [4,2], [4,1], [4,0]],
      ];
      expect(isReturningInOtherBranch(parallelTrace[1], parallelTrace)).to.be.false;
    });

    test('isEquallyGood', () => {
      const returningTrace: Trace[] = [
        [[1,0], [2,0], [3,0], [4,0]],
        [[3,2], [3,1], [3,0], [2,0]],
      ];
      expect(isEquallyGood(returningTrace[1], returningTrace)).to.be.false;

      const parallelTrace: Trace[] = [
        [[1,0], [2,0], [3,0], [4,0]],
        [[4,3], [4,2], [4,1], [4,0]],
      ];
      expect(isEquallyGood(parallelTrace[1], parallelTrace)).to.be.true;
    });

    test('isWorse', () => {
      const returningTrace: Trace[] = [
        [[1,0], [2,0], [3,0], [4,0]],
        [[3,2], [3,1], [3,0], [4,0]],
      ];
      expect(isWorse(returningTrace[1], returningTrace)).to.be.false;

      const parallelTrace: Trace[] = [
        [[1,0], [2,0], [3,0], [4,0]],
        [[4,3], [4,2], [4,1], [4,0]],
      ];
      expect(isWorse(parallelTrace[1], parallelTrace)).to.be.false;

      const worseTrace: Trace[] = [
        [[1,0], [2,0], [3,0], [4,0]],
        [[3,3], [3,2], [3,1], [3,0]],
      ];
      expect(isWorse(worseTrace[1], worseTrace)).to.be.true;
    });
  });

  describe.skip('eliminate dead branch', () => {
    test('1', () => {
      const input = `
      #################
      #.#.#...#####.#E#
      #.#.########.##.#
      #S..............#
      #################`;
      const expected = `
      #################
      #######.#####.#E#
      ###############.#
      #S..............#
      #################`;
      const map = parseMap(input);

      eliminateDeadBranches(map);
      const expectedDrawn = draw([], parseMap(expected));
      const result = draw([], map);
      expect(result).to.deep.equal(expectedDrawn);
    });

    test('2', () => {
      const input = `
      #################
      #####...###....E#
      #.#.########.##.#
      #S..............#
      #################`;
      const expected = `
      #################
      #######.####...E#
      ############.##.#
      #S..............#
      #################`;
      const map = parseMap(input);

      eliminateDeadBranches(map);
      const expectedDrawn = draw([], parseMap(expected));
      const result = draw([], map);
      expect(result).to.deep.equal(expectedDrawn);
    });

    test('3', () => {
      const input = `
      #################
      #####....##....E#
      #.#.#.##.###.##.#
      #S..............#
      #################`;
      const expected = `
      #################
      #####....###...E#
      #####.##.###.##.#
      #S..............#
      #################`;
      const map = parseMap(input);

      eliminateDeadBranches(map);
      const expectedDrawn = draw([], parseMap(expected));
      const result = draw([], map);
      for(let i = 0; i < map.length; i++) {
        expect(result[i]).to.deep.equal(expectedDrawn[i], `Row ${i}`);
      }
      expect(result).to.deep.equal(expectedDrawn);
    });

    test('4 cuts bad branc', () => {
      const input = `
      #################
      #####....##....E#
      #.#.#.##.###.##.#
      #S..............#
      #################`;
      const expected = `
      #################
      #####....##....E#
      #.#.#.######.##.#
      #S..............#
      #################`;
      const map = parseMap(input);

      eliminateBadBranches(map);
      const expectedDrawn = draw([], parseMap(expected));
      const result = draw([], map);
      for(let i = 0; i < map.length; i++) {
        expect(result[i]).to.deep.equal(expectedDrawn[i], `Row ${i}`);
      }
      expect(result).to.deep.equal(expectedDrawn);
    });

    test('5 keeps equaly good branches', () => {
      const input = `
      #################
      #############..E#
      #####.........###
      #####.#######.###
      #S............###
      #################`;
      const expected = `
      #################
      #############..E#
      #####.........###
      #####.#######.###
      #S............###
      #################`;
      const map = parseMap(input);

      eliminateBadBranches(map);
      const expectedDrawn = draw([], parseMap(expected));
      const result = draw([], map);
      for(let i = 0; i < map.length; i++) {
        expect(result[i]).to.deep.equal(expectedDrawn[i], `Row ${i}`);
      }
      expect(result).to.deep.equal(expectedDrawn);
    });
  });

  describe.skip('improve map', () => {
    test('eliminate answer 1', async () => {
      const input = await readFile(join(__dirname, '16.txt'), { encoding: 'utf8' });
      const map = parseMap(input);

      eliminateDeadBranches(map);

      const strMap = map.map(r => r.join('')).join('\n');
      await writeFile(join(__dirname, '16e.txt'), strMap, { encoding: 'utf8' });
    });

    test('eliminate answer 2', async () => {
      const input = await readFile(join(__dirname, '16e.txt'), { encoding: 'utf8' });
      const map = parseMap(input);

      eliminateDeadBranches(map);

      const strMap = map.map(r => r.join('')).join('\n');
      await writeFile(join(__dirname, '16e2.txt'), strMap, { encoding: 'utf8' });
    });

    test('eliminate bad answer 1', async () => {
      const input = await readFile(join(__dirname, '16e2.txt'), { encoding: 'utf8' });
      const map = parseMap(input);

      eliminateBadBranches(map);

      const strMap = map.map(r => r.join('')).join('\n');
      await writeFile(join(__dirname, '16e2b.txt'), strMap, { encoding: 'utf8' });
    });

    test('eliminate dead answer 3', async () => {
      const input = await readFile(join(__dirname, '16e2b.txt'), { encoding: 'utf8' });
      const map = parseMap(input);

      eliminateDeadBranches(map);

      const strMap = map.map(r => r.join('')).join('\n');
      await writeFile(join(__dirname, '16e2be.txt'), strMap, { encoding: 'utf8' });
    });
  });
});
