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

export function getAntinodes(p1: Position, p2: Position, mapDimensions: readonly [number, number]): Position[] {
    const diff = [
        p1[0] - p2[0],
        p1[1] - p2[1],
    ];

    const possibleNodes: Position[] = [
        [p1[0] + diff[0], p1[1] + diff[1]],
        [p1[0] - diff[0], p1[1] + diff[1]],
        [p1[0] + diff[0], p1[1] - diff[1]],
        [p1[0] - diff[0], p1[1] - diff[1]],
        [p2[0] + diff[0], p2[1] + diff[1]],
        [p2[0] - diff[0], p2[1] + diff[1]],
        [p2[0] + diff[0], p2[1] - diff[1]],
        [p2[0] - diff[0], p2[1] - diff[1]],
    ];

    const filteredNodes = possibleNodes.filter(n => {
        const diff1 = Math.sqrt(Math.pow(n[0] - p1[0], 2) + Math.pow(n[1] - p1[1], 2));
        const diff2 = Math.sqrt(Math.pow(n[0] - p2[0], 2) + Math.pow(n[1] - p2[1], 2));

        return diff1 == 2 * diff2 || diff2 == 2 * diff1;
    });

    const uniqueNodesSet = new Set(filteredNodes.map(n => `${n[0]},${n[1]}`));
    const uniqueNodes = Array.from(uniqueNodesSet.values()).map(v => v.split(',').map(n => parseInt(n, 10))) as Position[];

    return uniqueNodes.filter(n => !isOutOfBounds(n, mapDimensions));
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

    //const notCoveringSignal = allAntinodes.filter(n => map[n[1]][n[0]] === '.');
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
