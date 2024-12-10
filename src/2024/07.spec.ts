import { readFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { generateCombinations, getCalibrationResult, Operator2, parseEquations, setOperators, testTruthiness } from "./07";

describe.skip('07', () => {
  beforeEach(() => setOperators(1));

  describe('part one', () => {
    test('example truthiness', () => {
      const input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
      const equations = parseEquations(input);
      const truthiness = equations.map(testTruthiness);

      expect(truthiness).to.deep.equal([
        [Operator2.Multiply],
        [Operator2.Add, Operator2.Multiply],
        false,
        false,
        false,
        false,
        false,
        false,
        [Operator2.Add, Operator2.Multiply, Operator2.Add],
      ]);

      expect(getCalibrationResult(equations)).to.equal(3749);
    });

    test('real data', async () => {
      const input = await readFile(join(__dirname, '07.txt'), { encoding: 'utf8' });
      const equations = parseEquations(input);

      expect(getCalibrationResult(equations)).to.equal(4555081946288);
    });
  });

  describe('part two', () => {
    test('example truthiness', () => {
      setOperators(2);
      const input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
      const equations = parseEquations(input);
      const truthiness = equations.map(testTruthiness);

      expect(truthiness).to.deep.equal([
        [Operator2.Multiply],
        [Operator2.Add, Operator2.Multiply],
        false,
        [Operator2.Concatenation],
        [Operator2.Multiply, Operator2.Concatenation, Operator2.Multiply],
        false,
        [Operator2.Concatenation, Operator2.Add],
        false,
        [Operator2.Add, Operator2.Multiply, Operator2.Add],
      ]);

      expect(getCalibrationResult(equations)).to.equal(11387);
    });

    test('real data', async () => {
      setOperators(2);
      const input = await readFile(join(__dirname, '07.txt'), { encoding: 'utf8' });
      const equations = parseEquations(input);

      expect(getCalibrationResult(equations)).to.equal(227921760109726);
    });
  });

  describe('helpers', () => {
    test('testTruthiness 1', () => {
      expect(testTruthiness({
        result: 25,
        values: [2,3,5],
      })).to.deep.equal([Operator2.Add, Operator2.Multiply]);

      expect(testTruthiness({
        result: 104,
        values: [3,4,4,6,8],
      })).to.deep.equal([Operator2.Multiply, Operator2.Add, Operator2.Multiply, Operator2.Add]);

      expect(testTruthiness({
        result: 1,
        values: [3,4,8,1,8],
      })).to.equal(false);
    });

    test('testTruthiness 2', () => {
      setOperators(2);
      expect(testTruthiness({
        result: 25,
        values: [2,5],
      })).to.deep.equal([Operator2.Concatenation]);

      expect(testTruthiness({
        result: 33,
        values: [1,1,3],
      })).to.deep.equal([Operator2.Concatenation, Operator2.Multiply]);

      expect(testTruthiness({
        result: 1,
        values: [3,4,8,1,8],
      })).to.equal(false);
    });

    test('generateCombinations', () => {
      expect(generateCombinations(2)).to.have.deep.members([
        [Operator2.Add, Operator2.Add],
        [Operator2.Add, Operator2.Multiply],
        [Operator2.Multiply, Operator2.Add],
        [Operator2.Multiply, Operator2.Multiply],
      ]);

      expect(generateCombinations(3).length).to.equal(8);
    });

    test('generateCombinations', () => {
      setOperators(2);
      expect(generateCombinations(2)).to.have.deep.members([
        [Operator2.Add, Operator2.Add],
        [Operator2.Add, Operator2.Multiply],
        [Operator2.Add, Operator2.Concatenation],
        [Operator2.Multiply, Operator2.Add],
        [Operator2.Multiply, Operator2.Multiply],
        [Operator2.Multiply, Operator2.Concatenation],
        [Operator2.Concatenation, Operator2.Add],
        [Operator2.Concatenation, Operator2.Multiply],
        [Operator2.Concatenation, Operator2.Concatenation],
      ]);

      expect(generateCombinations(3).length).to.equal(27);
    });
  });
});