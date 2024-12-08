import { expect, test, describe } from 'vitest'
import { readFile } from 'fs/promises';
import { join } from 'path';
import { countMatches, iterateBoard, selectAllPossible2, selectDiagonalLeftDown, selectDiagonalLeftUp, selectDiagonalRightDown, selectDiagonalRightUp, selectHorizontal, selectHorizontalInverse, selectVertical, selectVerticalInverse } from './04';
import { moveCursor } from 'readline';


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

    test('test diagonal right up', () => {
      const input = `...S
..A.
.M..
X...`
      const board = parseBoard(input);
      expect(selectDiagonalRightUp(board, [0, 3])).to.deep.equal(expected);
    });
  });
  

  describe('part1', () => {
    test('test set', () => {
      const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
        const expected = 'XMAS';
        const board = parseBoard(input);
        let matchesCount = 0;
        iterateBoard(board, (board, position) => {
          matchesCount += countMatches(board, position, expected);
        });

        expect(matchesCount).to.equal(18);
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '04.txt'), { encoding: 'utf8' });
      const expected = 'XMAS';
      const board = parseBoard(content);
      let matchesCount = 0;
      iterateBoard(board, (board, position) => {
        matchesCount += countMatches(board, position, expected);
      });

      expect(matchesCount).to.equal(2530);
    });
  });

  describe('part2', () => {
    test('test set', () => {
      const input = `.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`;
        const expected = 'MAS';
        const board = parseBoard(input);
        let matchesCount = 0;

        iterateBoard(board, (board, position) => {
          const matches = selectAllPossible2(board, position);
          const xShapeMatchesCount = matches.filter(m => m.join('') === expected).length;
          matchesCount += xShapeMatchesCount === 2 ? 1 : 0;
        });

        expect(matchesCount).to.equal(9);
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '04.txt'), { encoding: 'utf8' });
      const expected = 'MAS';
      const board = parseBoard(content);
      let matchesCount = 0;
      iterateBoard(board, (board, position) => {
        const matches = selectAllPossible2(board, position);
        const xShapeMatchesCount = matches.filter(m => m.join('') === expected).length;
        matchesCount += xShapeMatchesCount === 2 ? 1 : 0;
      });

      expect(matchesCount).to.be.below(5493, 'Tested, incorrect, too high');
      expect(matchesCount).to.equal(1921);
    });
  });
});
