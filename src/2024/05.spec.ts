import { expect, test, describe } from 'vitest'
import { readFile } from 'fs/promises';
import { join } from 'path';
import { findBrokenRule, fixUpdate, getUpdateMiddle } from './05';

const testInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

function parseInput(input: string) {
  const rows = input.split('\n');
  const rules: [number, number][] = [];
  const updates: number[][] = [];

  let i = 0;
  for(;i < rows.length; i++) {
    if (rows[i].trim() === '') break;
    const rule = rows[i].split('|').map(v => parseInt(v, 10))
    rules.push(rule as any);
  }

  // Skip blank separation line
  i++;

  for(;i < rows.length; i++) {
    if (rows[i].trim() === '') break;
    const update = rows[i].split(',').map(v => parseInt(v, 10))
    updates.push(update);
  }

  return { rules, updates };
}

describe.skip('5', () => {

  describe('part1', () => {
    test('test set', () => {
        const { rules, updates } = parseInput(testInput);
        expect(rules[0]).to.deep.equal([47,53]);
        expect(rules[rules.length-1]).to.deep.equal([53,13]);
        expect(updates[0]).to.deep.equal([75,47,61,53,29]);
        expect(updates[updates.length - 1]).to.deep.equal([97,13,75,29,47]);

        let sum = 0;
        for(const update of updates) {
          const brokenRule = findBrokenRule(rules, update);
          if (brokenRule === null) {
            sum += getUpdateMiddle(update);
          }
        }

        expect(sum).to.equal(143);
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '05.txt'), { encoding: 'utf8' });
      const { rules, updates } = parseInput(content);
      expect(rules[0]).to.deep.equal([56,54]);
      expect(rules[rules.length-1]).to.deep.equal([11,37]);
      expect(updates[0]).to.deep.equal([38,33,35,91,62,74,57,54,15,73,64,61,65,32,25,19,21,39,58,26,79]);
      expect(updates[updates.length - 1]).to.deep.equal([19,15,79,98,64,21,16,67,42,73,17,13,26,28,41]);

      let sum = 0;
      for(const update of updates) {
        const brokenRule = findBrokenRule(rules, update);
        if (brokenRule === null) {
          sum += getUpdateMiddle(update);
        }
      }

      expect(sum).to.equal(5948);
    });
  });

  describe('part2', () => {
    test('test set', () => {
        const { rules, updates } = parseInput(testInput);
        expect(rules[0]).to.deep.equal([47,53]);
        expect(rules[rules.length-1]).to.deep.equal([53,13]);
        expect(updates[0]).to.deep.equal([75,47,61,53,29]);
        expect(updates[updates.length - 1]).to.deep.equal([97,13,75,29,47]);

        let sum = 0;
        for(const update of updates) {
          const brokenRule = findBrokenRule(rules, update);
          if (brokenRule !== null) {
            const fixed = fixUpdate(rules, update);
            if(findBrokenRule(rules, fixed) !== null) {
              throw new Error('Incorrect fix');
            }

            sum += getUpdateMiddle(fixed);
          }
        }

        expect(sum).to.equal(123);
    });

    test('real set', async () => {
      const content = await readFile(join(__dirname, '05.txt'), { encoding: 'utf8' });
      const { rules, updates } = parseInput(content);
      expect(rules[0]).to.deep.equal([56,54]);
      expect(rules[rules.length-1]).to.deep.equal([11,37]);
      expect(updates[0]).to.deep.equal([38,33,35,91,62,74,57,54,15,73,64,61,65,32,25,19,21,39,58,26,79]);
      expect(updates[updates.length - 1]).to.deep.equal([19,15,79,98,64,21,16,67,42,73,17,13,26,28,41]);

      let sum = 0;
      for(const update of updates) {
        const brokenRule = findBrokenRule(rules, update);
        if (brokenRule !== null) {
          const fixed = fixUpdate(rules, update);
          if(findBrokenRule(rules, fixed) !== null) {
            throw new Error('Incorrect fix');
          }

          sum += getUpdateMiddle(fixed);
        }
      }

      expect(sum).to.equal(3062);
    });
  });
});
