import { expect, test, describe } from 'vitest'
import { listsDistance, listsSimilarity } from './01';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('1', () => {
  describe('part1', () => {
    test('test set', () => {
      expect(listsDistance(
        [3,4,2,1,3,3],
        [4,3,5,3,9,3],
      )).toBe(11);
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '01.txt'), { encoding: 'utf8' });
      const rows = content.split('\n');
      const a = rows.map(r => parseInt(r.split('   ')[0], 10));
      const b = rows.map(r => parseInt(r.split('   ')[1], 10));

      expect(a[0]).to.equal(85215);
      expect(b[0]).to.equal(94333);
      expect(a[999]).to.equal(78957);
      expect(b[999]).to.equal(74568);

      expect(listsDistance(a, b)).toBe(1319616);
    });
  });

  describe('part2', () => {
    test('test set', () => {
      expect(listsSimilarity(
        [3,4,2,1,3,3],
        [4,3,5,3,9,3],
      )).toBe(31);
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '01.txt'), { encoding: 'utf8' });
      const rows = content.split('\n');
      const a = rows.map(r => parseInt(r.split('   ')[0], 10));
      const b = rows.map(r => parseInt(r.split('   ')[1], 10));

      expect(a[0]).to.equal(85215);
      expect(b[0]).to.equal(94333);
      expect(a[999]).to.equal(78957);
      expect(b[999]).to.equal(74568);

      expect(listsSimilarity(a, b)).toBe(27267728);
    });
  });
});
