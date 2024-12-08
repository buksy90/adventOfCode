import { expect, test, describe } from 'vitest'
import { countSafeReports, isSafeReport, problemDampener } from './02';
import { readFile } from 'fs/promises';
import { join } from 'path';

describe('2', () => {
  describe('part1', () => {
    test('test set', () => {
      const reports = [
        [7, 6, 4, 2, 1],
        [1, 2, 7, 8, 9],
        [9, 7, 6, 2, 1],
        [1, 3, 2, 4, 5],
        [8, 6, 4, 4, 1],
        [1, 3, 6, 7, 9]
      ];

      expect(isSafeReport(reports[0])).toBeTruthy();
      expect(isSafeReport(reports[1])).toBeFalsy();
      expect(isSafeReport(reports[2])).toBeFalsy();
      expect(isSafeReport(reports[3])).toBeFalsy();
      expect(isSafeReport(reports[4])).to.be.false;
      expect(isSafeReport(reports[5])).to.be.true;
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '02.txt'), { encoding: 'utf8' });
      const rows = content.split('\n');
      const reports = rows.map(row => row.split(' ').map(v => parseInt(v, 10)));

      expect(reports.length).to.equal(1000, 'Some rows are missing');
      expect(reports[0]).to.deep.equal([74,76,78,79,76]);
      expect(reports[999]).to.deep.equal([59,58,55,53,52]);

      const safeReports = countSafeReports(reports);

      // 263 has been tested as incorrect result !!!
      expect(safeReports).to.not.equal(263, 'This is incorrect answer, already tested');

      expect(safeReports).to.equal(257);
    });
  });

  describe('part2', () => {
    test('test set', () => {
      const reports = [
        [7, 6, 4, 2, 1],
        [1, 2, 7, 8, 9],
        [9, 7, 6, 2, 1],
        [1, 3, 2, 4, 5],
        [8, 6, 4, 4, 1],
        [1, 3, 6, 7, 9]
      ];

      expect(problemDampener(reports[0])).to.equal(null, 'no change required');
      expect(problemDampener(reports[1])).to.equal(false, 'cannot be fixed');
      expect(problemDampener(reports[2])).to.equal(false, 'cannot be fixed');
      expect(problemDampener(reports[3])).to.equal(1, 'second level removed fixed report');
      expect(problemDampener(reports[4])).to.equal(2, 'third level removed fixed report');
      expect(problemDampener(reports[5])).to.equal(null, 'no change required');
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '02.txt'), { encoding: 'utf8' });
      const rows = content.split('\n');
      const reports = rows.map(row => row.split(' ').map(v => parseInt(v, 10)));

      expect(reports.length).to.equal(1000, 'Some rows are missing');
      expect(reports[0]).to.deep.equal([74,76,78,79,76]);
      expect(reports[999]).to.deep.equal([59,58,55,53,52]);

      const dumpedResults = reports.map(r => problemDampener(r));
      const safeReports = dumpedResults.filter(v => v !== false);
      // 291 Incorrect ansewr, too low
      expect(safeReports.length).to.be.above(291, 'incorrect answer, too low');
      expect(safeReports.length).to.be.below(1000, 'incorrect answer, too high');

      expect(safeReports.length).to.equal(328);
    });
  });
});
