import { expect, test, describe, beforeEach } from 'vitest'
import { readFile } from 'fs/promises';
import { join } from 'path';
import { moveDisk, parseDisk, strDisc } from './09';


describe('6', () => {
  describe('fns', () => {
    test('parseDisk examle', async () => {
      const input = '12345';
      const visualized = parseDisk(input);
      expect(visualized).to.deep.equal([
        { blocksCount: 1, id: 0, isFile: true, value: 1 },
        { blocksCount: 2, id: -1, isFile: false, value: 2 },
        { blocksCount: 3, id: 1, isFile: true, value: 3 },
        { blocksCount: 4, id: -1, isFile: false, value: 4 },
        { blocksCount: 5, id: 2, isFile: true, value: 5 },
      ]);
    });

    test('parseDisk examle 2', async () => {
      const input = '2333133121414131402';
      const visualized = parseDisk(input);
      expect(visualized).to.deep.equal([
        { blocksCount: 2, id: 0, isFile: true, value: 2 },
        { blocksCount: 3, id: -1, isFile: false, value: 3 },
        { blocksCount: 3, id: 1, isFile: true, value: 3 },
        { blocksCount: 3, id: -1, isFile: false, value: 3 },
        { blocksCount: 1, id: 2, isFile: true, value: 1 },
        { blocksCount: 3, id: -1, isFile: false, value: 3 },
        { blocksCount: 3, id: 3, isFile: true, value: 3 },
        { blocksCount: 1, id: -1, isFile: false, value: 1 },
        { blocksCount: 2, id: 4, isFile: true, value: 2 },
        { blocksCount: 1, id: -1, isFile: false, value: 1 },
        { blocksCount: 4, id: 5, isFile: true, value: 4 },
        { blocksCount: 1, id: -1, isFile: false, value: 1 },
        { blocksCount: 4, id: 6, isFile: true, value: 4 },
        { blocksCount: 1, id: -1, isFile: false, value: 1 },
        { blocksCount: 3, id: 7, isFile: true, value: 3 },
        { blocksCount: 1, id: -1, isFile: false, value: 1 },
        { blocksCount: 4, id: 8, isFile: true, value: 4 },
        { blocksCount: 0, id: -1, isFile: false, value: 0 },
        { blocksCount: 2, id: 9, isFile: true, value: 2 },
      ]);
    });

    test('strDisk', () => {
      const input = '12345';
      const visualized = parseDisk(input);
      const str = strDisc(visualized);

      expect(str).to.equal('0..111....22222');
    });

    test('strDisk', () => {
      const input = '2333133121414131402';
      const visualized = parseDisk(input);
      const str = strDisc(visualized);

      expect(str).to.equal('00...111...2...333.44.5555.6666.777.888899');
    });

    test.only('moveDisc', () => {
      const input = '12345';
      const visualized = parseDisk(input);

      console.log(strDisc(visualized));
      moveDisk(visualized);

      expect(strDisc(visualized)).to.equal('022111222......');
    });
  });
});
