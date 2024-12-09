import { expect, test, describe, beforeEach } from 'vitest'
import { readFile } from 'fs/promises';
import { join } from 'path';
import { hashDisc, moveDisc, moveDisc2, parseDisk, strDisc, validateDisc } from './09';

describe.skip('9', () => {
  describe('part one', () => {
    test('real data', async () => {
      const content = await readFile(join(__dirname, '09.txt'), { encoding: 'utf8' });

      const disc = parseDisk(content);
      moveDisc(disc);

      expect(hashDisc(disc)).to.equal(6519155389266);
    });
  });

  describe('part two', () => {
    test('example', () => {
      const input = '2333133121414131402';
      const disc = parseDisk(input);
      moveDisc2(disc);
      validateDisc(disc);

      expect(hashDisc(disc)).to.equal(2858);
    });

    test('real data', async () => {
      const content = await readFile(join(__dirname, '09.txt'), { encoding: 'utf8' });

      const disc = parseDisk(content);
      moveDisc2(disc);
      validateDisc(disc);
      
      expect(hashDisc(disc)).to.be.above(6531794764631, 'tested, too low');
      expect(hashDisc(disc)).to.equal(6547228115826);
    });
  });

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

    test('moveDisc', () => {
      const input = '12345';
      const visualized = parseDisk(input);
      moveDisc(visualized);

      expect(strDisc(visualized)).to.equal('022111222......');
    });

    test('moveDisc other example', () => {
      const input = '2333133121414131402';
      const visualized = parseDisk(input);
      moveDisc(visualized);

      expect(strDisc(visualized)).to.equal('0099811188827773336446555566..............');
    });

    test('moveDisc2', () => {
      const input = '2333133121414131402';
      const disc = parseDisk(input);
      moveDisc2(disc);
      validateDisc(disc);

      expect(strDisc(disc)).to.equal('00992111777.44.333....5555.6666.....8888..');
    });

    test('hashDisc', () => {
      const input = '12345';
      const visualized = parseDisk(input);
      moveDisc(visualized);

      expect(hashDisc(visualized)).to.equal(60);
    });

    test('hashDisc2', () => {
      const input = '2333133121414131402';
      const disc = parseDisk(input);
      moveDisc(disc);

      expect(hashDisc(disc)).to.equal(1928);
    });
  });
});
