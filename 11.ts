import { createWriteStream } from 'fs';
import { readFile, open } from 'fs/promises';
import { join } from 'path';

type Stones = number[];

type List = {
    value: number;
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

type StonesList = {
    depth: number;
    list: List;
}
type StonesState = [number, ...StonesList[]];
export function blinkState(state: StonesState): StonesState {
    //console.log({ sum: state[0], stateLength: state.length });
    if (state.length === 1) return state;

    const lastList = state.pop() as StonesList;
    const firstStone = lastList.list.value;
    const nextListItem = lastList.list.next;
    if (nextListItem) {
        lastList.list = nextListItem;
        state.push(lastList);
    }

    const newStones = transformStone(firstStone);
    if (lastList.depth === 1) {
        state[0] += newStones.length;
        return blinkState(state);
    }

    state.push({ depth: lastList.depth - 1, list: toList(newStones) });
    return blinkState(state);
}


/*
export function blinkNumber(input: number, depth: number): number {
    if (depth === 0) return 1;
    const transformed = transformStone(input);
    return transformed.length === 1
        ? blinkNumber(transformed[0], depth - 1)
        : blinkNumber(transformed[0], depth - 1) + blinkNumber(transformed[1], depth - 1);
}*/

/*
const TEMP_FILE = join(__dirname, '11.tmp');
export async function blinkListInBatches(input: Stones) {

    input = await readFile(TEMP_FILE, { encoding: 'utf8' });
}


export async function* readInput(): AsyncGenerator {
    const fd = await open('sample.txt');
    const fileSize = (await fd.stat()).size;
    const stream = fd.createReadStream();
    stream.setEncoding('utf8');

    let pos = 0;
    let leftover = '';
    while(pos <= fileSize) {
        const data = stream.read(512) as string;
        const chunks = (leftover + data).split(' ');

        leftover = chunks.pop() || '';

        yield chunks.map(s => parseInt(s, 10));
    }

    return null;
}
*/