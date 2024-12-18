import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

type Stones = number[];

type List = {
    value: BigInt | number;
    next: List | null;
}

const nullList = { value: 0, next: null };
export function toList(stones: Stones): List {
    let prev: List | null = null;
    let n: number | undefined;
    while((n = stones.pop()) !== undefined) {
        if (n === undefined) break;

        const next: List = { value: n, next: prev };
        prev = next;
    }

    return prev || nullList;
}

export function listToArray(list: List): Stones {
    const arr: Stones = [ Number(list.value) ];
    let ptr = list.next;
    while(ptr) {
        const converted: number = typeof ptr.value === 'bigint' ? Number(ptr.value) : ptr.value as number;
        arr.push(converted);
        ptr = ptr.next
    }
    return arr;
}

export function listSize(list: List): number {
    let i = 0;
    let ptr: List['next'] = list;
    while(ptr) {
        ptr = ptr.next;
        i++;
    }
    return i;
}

function transformStone(stone: number): number[] {
    if (stone === 0) return [1];

    const str = stone.toString();
    if (str.length % 2 === 0) {
        return [
            str.substring(0, str.length/2),
            str.substring(str.length/2),
        ].map(s => parseInt(s));
    }

    const mul = stone * 2024;
    if (mul > Number.MAX_SAFE_INTEGER) {
        throw new Error('Too big');
    }
    return [mul];
}

export function blink(stones: Stones): Stones {
    const transformed = stones.reduce((acc, stone) => {
        acc.push(...transformStone(stone));
        return acc;
    }, [] as Stones);

    return transformed;
}

export function blinkList(list: List): List {
    let current: List['next'] = list;
    let i = 0;
    while(current) {
        const next: List['next'] = current.next;
        const transformed = transformStone(current.value as number);
        if (transformed.length === 1) {
            current.value = transformed[0];
            i++;
        } else if (transformed.length === 2) {
            const extra: List = {
                value: transformed[1],
                next,
            };
            current.value = transformed[0];
            current.next = extra;
            i+=2;
        }

        current = next;
    }

    console.log({i});

    return list;
}

const TEMP_FILE = join(__dirname, '11.tmp');
export async function blinkListInBatches() {
    input = await readFile(TEMP_FILE, { encoding: 'utf8' });
}