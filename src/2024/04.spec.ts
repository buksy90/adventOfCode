import { expect, test, describe } from 'vitest'
import { readFile } from 'fs/promises';
import { join } from 'path';
import { selectDiagonalLeftDown, selectDiagonalLeftUp, selectDiagonalRightDown, selectHorizontal, selectHorizontalInverse, selectVertical, selectVerticalInverse } from './04';


function parseBoard(input: string): string[][] {
  return input.split('\n').map(r => r.split(''));
}

describe('4', () => {
  describe('selections', () => {
    const expected = ['X', 'M', 'A', 'S'];

    test('coordinates', () => {
      const input = `ABCD
EFGH
IJKL
MNOP`
            const board = parseBoard(input);
            expect(selectHorizontal(board, [0, 0])).to.deep.equal(['A', 'B', 'C', 'D']);
            expect(selectHorizontal(board, [0, 1])).to.deep.equal(['E', 'F', 'G', 'H']);
    });
    test('test selections', () => {
      const input = `XMAS
MM..
A.A.
S..S`
      const board = parseBoard(input);
      expect(selectHorizontal(board, [0, 0])).to.deep.equal(expected);
      expect(selectVertical(board, [0, 0])).to.deep.equal(expected);
      expect(selectDiagonalRightDown(board, [0, 0])).to.deep.equal(expected);
    });

    test('test selections invert', () => {
      const input = `S..S
.A.A
..MM
SAMX`
      const board = parseBoard(input);
      expect(selectHorizontalInverse(board, [3, 3])).to.deep.equal(expected);
      expect(selectVerticalInverse(board, [3, 3])).to.deep.equal(expected);
      expect(selectDiagonalLeftUp(board, [3, 3])).to.deep.equal(expected);
    });

    test('test diagonal left down', () => {
      const input = `...X
..M.
.A..
S...`
      const board = parseBoard(input);
      expect(selectDiagonalLeftDown(board, [3, 0])).to.deep.equal(expected);
    });
  });
  

});
