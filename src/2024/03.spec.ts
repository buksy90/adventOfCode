import { expect, test, describe } from 'vitest'
import { countSafeReports, isSafeReport, problemDampener } from './02';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { calculate, filterEnabled, filterMulOp, filterNonCorrupted } from './03';

describe.skip('2', () => {
  describe('part1', () => {
    test('test set', () => {
      const memory = 'xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))';
      const recognized = filterNonCorrupted(memory);
      const mulOperations = filterMulOp(recognized);
      expect(calculate(mulOperations)).to.equal(161);
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '03.txt'), { encoding: 'utf8' });
      const recognized = filterNonCorrupted(content);
      const mulOperations = filterMulOp(recognized);
      const result = calculate(mulOperations);

      // correct: 169021493
      expect(result).to.equal(169021493);
    });
  });

  describe('part2', () => {
    test('test set', () => {
      const memory = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
      const recognized = filterNonCorrupted(memory);
      const mulOperations = filterEnabled(recognized);
      expect(calculate(mulOperations)).to.equal(48);
    });


    test('real set', async () => {
      const content = await readFile(join(__dirname, '03.txt'), { encoding: 'utf8' });
      const recognized = filterNonCorrupted(content);

      expect(recognized[0]).to.equal('mul(371,776)');
      expect(recognized[recognized.length - 1]).to.equal('mul(671,828)');

      const mulOperations = filterEnabled(recognized);
      const result = calculate(mulOperations);

      expect(result).to.be.below(169021493, 'Expecting lower result than from part1');
      expect(result).to.equal(111762583);
    });
  });
});
