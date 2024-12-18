import { readFile } from 'fs/promises';
import { join } from 'path';
import { beforeEach, describe, expect, test } from "vitest";
import { blink, blinkList, listSize, listToArray, toList } from '../../11';


describe('11', () => {
  describe('part one', () => {
    test('answer', () => {
        let stones = [70949, 6183, 4, 3825336, 613971, 0, 15, 182];
        for(let i = 0; i < 25; i++) {
            stones = blink(stones);
        }
        expect(stones.length).to.equal(185205);
    });

    test.only('answer 2', () => {
        let stones = [70949, 6183, 4, 3825336, 613971, 0, 15, 182];
        const list = toList(stones);

        for(let i = 0; i < 15; i++) {
            blinkList(list);
        }

        const size = listSize(list);
        expect(size).to.be.above(185205);
        expect(size).to.equal('?');
    });
  });

  describe('helpers', () => {
    test('blink list', () => {
        const stones = [0, 1, 10, 99, 999];
        const list = toList(stones);
        const blinked = blinkList(list);
        const a = listToArray(blinked);

        expect(a).to.deep.equal([1, 2024, 1, 0, 9, 9, 2021976]);
        expect(listSize(blinked)).to.equal(7);
    });

    test('blink list 2', () => {
        const stones = [0, 1, 10, 99, 999];
        const list = toList(stones);
        const blinked = blinkList(list);
        const a = listToArray(blinked);

        expect(a).to.deep.equal([1, 2024, 1, 0, 9, 9, 2021976]);
        expect(listSize(blinked)).to.equal(7);
    });

    test('blink list 2.5', () => {
        let stones = [125, 17];
        const list = toList(stones);

        for(let i = 0; i < 25; i++) {
            blinkList(list);
        }
        expect(listSize(list)).to.equal(55312)
    });

    test('blink example 2', () => {
        let stones = [125, 17];

        stones = blink(stones);
        expect(stones).to.deep.equal([253000, 1, 7]);

        stones = blink(stones);
        expect(stones).to.deep.equal([253, 0, 2024, 14168]);

        stones = blink(stones);
        expect(stones).to.deep.equal([512072, 1, 20, 24, 28676032]);

        stones = blink(stones);
        expect(stones).to.deep.equal([512, 72, 2024, 2, 0, 2, 4, 2867, 6032]);

        stones = blink(stones);
        expect(stones).to.deep.equal([1036288, 7, 2, 20, 24, 4048, 1, 4048, 8096, 28, 67, 60, 32]);

        stones = blink(stones);
        expect(stones).to.deep.equal([2097446912, 14168, 4048, 2, 0, 2, 4, 40, 48, 2024, 40, 48, 80, 96, 2, 8, 6, 7, 6, 0, 3, 2]);
    });

    test('blink example 2.5', () => {
        let stones = [125, 17];
        for(let i = 0; i < 25; i++) {
            stones = blink(stones);
        }
        expect(stones.length).to.equal(55312)
    });
  });
});
