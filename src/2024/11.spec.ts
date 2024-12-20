import { readFile } from 'fs/promises';
import { join } from 'path';
//import {describe, test, expect} from "bun:test";
import {describe, test, expect} from "vitest";
import { blink, blinkList, blinkState, listSize, listToArray, toList } from '../../11';


describe('11', () => {
  describe('part one', () => {
    test('answer', () => {
        let stones = [70949, 6183, 4, 3825336, 613971, 0, 15, 182];
        for(let i = 0; i < 25; i++) {
            stones = blink(stones);
        }
        expect(stones.length).toEqual(185205);
    });

    test.skip('answer 2', () => {
        let stones = [70949, 6183, 4, 3825336, 613971, 0, 15, 182];
        const list = toList(stones);

        for(let i = 0; i < 75; i++) {
            console.log({i});
            blinkList(list);
        }

        const size = listSize(list);
        expect(size).toBeGreaterThan(185205);
        expect(size).toEqual('?' as any);
    });

    test.skip('answer 1 (blinkState)', () => {
        let stones = [70949, 6183, 4, 3825336, 613971, 0, 15, 182];
        const state = blinkState([0, { depth: 25, list: toList(stones)} ]);
        expect(state[0]).toEqual(185205);
    });

    test.skip('answer 2 (blinkState)', () => {
        let stones = [70949, 6183, 4, 3825336, 613971, 0, 15, 182];
        const state = blinkState([0, { depth: 75, list: toList(stones)} ]);
        expect(state[0]).toEqual(185205);
    });

    describe('answer 2, partial', () => {
        test.only('stone 1', () => {
            let stones = [70949];
            const state = blinkState([0, { depth: 75, list: toList(stones)} ]);
            expect(state[0]).toEqual("?");
        });
    });
  });

  describe('helpers', () => {
    test('blink list', () => {
        const stones = [0, 1, 10, 99, 999];
        const list = toList(stones);
        const blinked = blinkList(list);
        const a = listToArray(blinked);

        expect(a).toEqual([1, 2024, 1, 0, 9, 9, 2021976]);
        expect(listSize(blinked)).toEqual(7);
    });

    test('blink list 2', () => {
        const stones = [0, 1, 10, 99, 999];
        const list = toList(stones);
        const blinked = blinkList(list);
        const a = listToArray(blinked);

        expect(a).toEqual([1, 2024, 1, 0, 9, 9, 2021976]);
        expect(listSize(blinked)).toEqual(7);
    });

    test('blink list 2.5', () => {
        let stones = [125, 17];
        const list = toList(stones);

        for(let i = 0; i < 25; i++) {
            blinkList(list);
        }
        expect(listSize(list)).toEqual(55312)
    });

    test('blink example 2', () => {
        let stones = [125, 17];

        stones = blink(stones);
        expect(stones).toEqual([253000, 1, 7]);

        stones = blink(stones);
        expect(stones).toEqual([253, 0, 2024, 14168]);

        stones = blink(stones);
        expect(stones).toEqual([512072, 1, 20, 24, 28676032]);

        stones = blink(stones);
        expect(stones).toEqual([512, 72, 2024, 2, 0, 2, 4, 2867, 6032]);

        stones = blink(stones);
        expect(stones).toEqual([1036288, 7, 2, 20, 24, 4048, 1, 4048, 8096, 28, 67, 60, 32]);

        stones = blink(stones);
        expect(stones).toEqual([2097446912, 14168, 4048, 2, 0, 2, 4, 40, 48, 2024, 40, 48, 80, 96, 2, 8, 6, 7, 6, 0, 3, 2]);
    });

    test('blink example 2.5', () => {
        let stones = [125, 17];
        for(let i = 0; i < 25; i++) {
            stones = blink(stones);
        }
        expect(stones.length).toEqual(55312)
    });
  });

  describe('blink count', () => {
    test('blinkState 1', () => {
        const state = blinkState([0, { depth: 2, list: toList([125, 17])} ]);
        expect(state[0]).toEqual(4);
    });

    test('blinkState 2', () => {
        const state = blinkState([0, { depth: 6, list: toList([125, 17])} ]);
        expect(state[0]).toEqual(22);
    });
  });
});
