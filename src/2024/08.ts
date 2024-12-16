export type TMap = string[][];
export type Position = [number, number];

function isOutOfBounds(position: Position, dimensions: readonly [number, number]): boolean {
    return position[0] < 0 || position[1] < 0 || position[0] >= dimensions[0] || position[1] >= dimensions[1];
  }

export function isDiagonal(p1: Position, p2: Position): number | false {
    const [x1, y1] = p1;
    const [x2, y2] = p2;

    const xDiff = Math.abs(x2 - x1);
    const yDiff = Math.abs(y2 - y1);

    return xDiff === yDiff ? xDiff : false;
}

let distance = 1;
export function setDistance(d: number) {
    distance = d;
}

function assertPolarity(n1: number, n2: number): boolean {
    return (n1 > 0 && n2 > 0) || (n1 < 0 && n2 < 0) || (n1 === 0 && n2 === 0);
}

export function getAntinodes(p1: Position, p2: Position, mapDimensions: readonly [number, number], anyDistance = false): Position[] {
    const diff = [
        p1[0] - p2[0],
        p1[1] - p2[1],
    ];

    const possibleNodes: Position[] = [];
    possibleNodes.push([p1[0] + distance * diff[0], p1[1] + distance * diff[1]]);
    possibleNodes.push([p1[0] - distance * diff[0], p1[1] + distance * diff[1]]);
    possibleNodes.push([p1[0] + distance * diff[0], p1[1] - distance * diff[1]]);
    possibleNodes.push([p1[0] - distance * diff[0], p1[1] - distance * diff[1]]);
    possibleNodes.push([p2[0] + distance * diff[0], p2[1] + distance * diff[1]]);
    possibleNodes.push([p2[0] - distance * diff[0], p2[1] + distance * diff[1]]);
    possibleNodes.push([p2[0] + distance * diff[0], p2[1] - distance * diff[1]]);
    possibleNodes.push([p2[0] - distance * diff[0], p2[1] - distance * diff[1]]);

    const possibleInboundNodes = possibleNodes.filter(n => !isOutOfBounds(n, mapDimensions));
    const visualization = draw(possibleInboundNodes, [p1, p2], mapDimensions);

    const filteredNodes = possibleInboundNodes.filter(n => {
        const diff1 = Math.sqrt(Math.pow(n[0] - p1[0], 2) + Math.pow(n[1] - p1[1], 2));
        const diff2 = Math.sqrt(Math.pow(n[0] - p2[0], 2) + Math.pow(n[1] - p2[1], 2));

        const nDiff = [ p1[0] - n[0], p1[1] - n[1] ];
        const ratio = [ nDiff[0] % diff[0], nDiff[1] % diff[1]];
        const polarity = (assertPolarity(nDiff[0], diff[0]) && assertPolarity(nDiff[1], diff[1])) || (!assertPolarity(nDiff[0], diff[0]) && !assertPolarity(nDiff[1], diff[1]));
        const condition = ratio[0] + ratio[1] === 0 && polarity;

        const ratioPoint = p1[0]+p1[1] > p2[0]+p2[1] ? p1[1] / p1[0] : p2[1] / p2[0];
        return anyDistance
        // ? Math.max(diff1, diff2) / Math.min(diff1, diff2) == 1.5
        //? n[1] / n[0] == ratioPoint
        ? condition
        : diff1 == 2 * diff2 || diff2 == 2 * diff1;
    });

    const uniqueNodesSet = new Set(filteredNodes.map(n => `${n[0]},${n[1]}`));
    const uniqueNodes = Array.from(uniqueNodesSet.values()).map(v => v.split(',').map(n => parseInt(n, 10))) as Position[];

    return uniqueNodes;
}

export function draw(antinodes: Position[], signals: Position[], mapDimensions: readonly [number, number]): number[][] {
    const map = (new Array(mapDimensions[1])).fill(null).map(() => (new Array(mapDimensions[0]).fill('.')));
    for(const antinode of antinodes)
        map[antinode[1]][antinode[0]] = '#';

    for(const signal of signals)
        map[signal[1]][signal[0]] = 'A';

    return map;
}

export function recognizeSignals(map: TMap): Map<string, Position[]> {
    const results = new Map<string, Position[]>();
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const signal = map[i][j];
            if (signal !== '.') {
                const signalList = results.get(signal) || [];
                signalList.push([j, i]);
                results.set(signal, signalList);
            }
        }
    }

    return results;
}

export function getAllAntinodes(map: TMap): Position[] {
    const dimensions = [map[0].length, map.length] as const;
    const signals = recognizeSignals(map);
    const allAntinodes: Position[] = [];

    for (const [signal, positions] of signals) {
        const antinodes = [];
        for(let i = 0; i < positions.length; i++) {
            for(let j = i + 1; j < positions.length; j++) {
                if (i === j) continue;
                antinodes.push(...getAntinodes(positions[i], positions[j], dimensions));
            }
        }

        allAntinodes.push(...antinodes);
    }

    const uniqueNodes = filterUniquePositions(allAntinodes);
    uniqueNodes.sort((a, b) => {
        if (a[1] === b[1]) return a[0] - b[0];
        return a[1] - b[1];
    });
    return uniqueNodes;
}

export function getAllAntinodesDistances(map: TMap) {
    const dimensions = [map[0].length, map.length] as const;
    const signals = recognizeSignals(map);
    const allAntinodes: Position[] = [];



    for (const [signal, positions] of signals) {
        const antinodes = [];
        for(let i = 0; i < positions.length; i++) {
            for(let j = i + 1; j < positions.length; j++) {
                if (i === j) continue;
                for (let d = 1; d < map.length * 2; d++) {
                    setDistance(d);
                    antinodes.push(...getAntinodes(positions[i], positions[j], dimensions, true));
                }
            }
        }

        allAntinodes.push(...antinodes);
    }

    setDistance(1);

    const uniqueNodes = filterUniquePositions(allAntinodes);
    uniqueNodes.sort((a, b) => {
        if (a[1] === b[1]) return a[0] - b[0];
        return a[1] - b[1];
    });
    return uniqueNodes;
}

function filterUniquePositions(positions: Position[]): Position[] {
    const uniqueNodesSet = new Set(positions.map(n => `${n[0]},${n[1]}`));
    return Array.from(uniqueNodesSet.values()).map(v => v.split(',').map(n => parseInt(n, 10))) as Position[];
}

export function parseMap(input: string): TMap {
    return input.split('\n').map(row => row.trim().split(''));
}

export function parseExpectedAntinodes(input: string): Position[] {
    const map = parseMap(input);
    return map.reduce((acc, row, y) => {
        const rowAntinodes: (Position | null)[] = row.map((c, x) => {
            return c === '#' ? [x, y] : null;
        });
        acc.push(...rowAntinodes.filter(v => v !== null) as Position[]);
        return acc;
    }, [] as Position[]);
}