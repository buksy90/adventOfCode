import { expect, test, describe, beforeEach } from 'vitest'
import { readFile } from 'fs/promises';
import { join } from 'path';
import { countRoute, Guard, hashPosition, iterateArea, resetStepsCount, step } from './06';

const testInput = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

function parseInput(input: string) {
  const rows = input.split('\n');
  const area = rows.map(r => r.split(''));
  
  const startPosition = [-1, -1];
  for(let y = 0; y < area.length; y++) {
    for(let x = 0; x < area[0].length; x++) {
      if(area[y][x] === '^') {
        startPosition[0] = x;
        startPosition[1] = y;
        y = Number.MAX_SAFE_INTEGER;
        break;
      }
    }
  }
  area[startPosition[1]][startPosition[0]] = '.';

  return {
    area,
    guard: { position: startPosition as any, direction: 0 } satisfies Guard,
  }
}

// TO BE FIXED !!
describe.skip('6', () => {
  beforeEach(() => resetStepsCount());

  describe('custom set', () => {
    test('1', async () => {
      const testInput = `#...
...#
^...
..#.`;
      const { area, guard: startUpGuard } = parseInput(testInput);
      const steppedPositions = await countRoute(area, startUpGuard, 20);
      expect(steppedPositions).to.equal(6);
    });
  });

  describe('part1', () => {
    test('test set', async () => {
      const { area, guard: startUpGuard } = parseInput(testInput);
      const steppedPositions = await countRoute(area, startUpGuard);

      expect(steppedPositions).to.equal(41);
    });

    test.only('real set', async () => {
      const content = await readFile(join(__dirname, '06.txt'), { encoding: 'utf8' });
      const { area, guard: startUpGuard } = parseInput(content);

      expect(area[0][0]).to.equal('.');
      expect(area[0][1]).to.equal('#');
      expect(area[area.length-1][0]).to.equal('.');
      expect(area[area.length-1][area[0].length-1]).to.equal('#');
      expect(area.length).to.equal(130);
      expect(area[0].length).to.equal(130);

      const steppedPositions = countRoute(area, startUpGuard);

      expect(steppedPositions).to.be.above(4695, 'incorrect, too low');
      expect(steppedPositions).to.equal(4696);
    });
  });

  describe('part2', () => {
    test('test set', () => {
      const { area, guard: startUpGuard } = parseInput(testInput);
      
      let sumLooped = 0;
      iterateArea(area, async (position) => {
        if(area[position[1]][position[0]] !== '.') return;
        if(position[0] === startUpGuard.position[0] && position[1] === startUpGuard.position[1]) return;

        area[position[1]][position[0]] = '#';
        resetStepsCount();
        // 17 works
        // 18 makes test stuck ? :O 
        const result = countRoute(area, startUpGuard, 19);

        if (result === false) sumLooped++;

        area[position[1]][position[0]] = '.';
      });

      expect(sumLooped).to.equal(6);
    });

    test.skip('real set', async () => {
      const content = await readFile(join(__dirname, '06.txt'), { encoding: 'utf8' });
      const { area, guard: startUpGuard } = parseInput(content);

      expect(area[0][0]).to.equal('.');
      expect(area[0][1]).to.equal('#');
      expect(area[area.length-1][0]).to.equal('.');
      expect(area[area.length-1][area[0].length-1]).to.equal('#');
      expect(area.length).to.equal(130);
      expect(area[0].length).to.equal(130);

      let guard: Guard | undefined = startUpGuard;
      let steppedPositions = new Set<string>([hashPosition(startUpGuard.position)]);
      while(guard = step(area, guard)) {
        if(guard === undefined) break;
        
        steppedPositions.add(hashPosition(guard.position));
        if(steppedPositions.size > 10000) throw new Error('Too many steps');
      }

      expect(steppedPositions.size).to.be.above(4695, 'incorrect, too low');
      expect(steppedPositions.size).to.equal(4696);
    });
  });

});
