type TMap = number[][];
type Position = [number, number];

function isOutOfBounds(position: Position, map: TMap): boolean {
    return position[0] < 0 || position[1] < 0 || position[0] >= map[0].length || position[1] >= map.length;
  }

export function isDiagonal(p1: Position, p2: Position): number | false {
    const [x1, y1] = p1;
    const [x2, y2] = p2;

    const xDiff = Math.abs(x2 - x1);
    const yDiff = Math.abs(y2 - y1);

    return xDiff === yDiff ? xDiff : false;
}

export function getAntinodes(p1: Position, p2: Position, map: TMap): Position[] {
    const diff = isDiagonal(p1, p2);
    if (diff === false) return [];

    const results: Position[] = [];

    // Vertical
    if (p1[0] === p2[0]) {
        results.push([Math.max(p1[0], p2[0]) + diff, p1[1]]);
        results.push([Math.min(p1[0], p2[0]) - diff, p1[1]]);
    }
    // Horizontal
    else if (p1[1] === p2[1]) {
        results.push([p1[0], Math.max(p1[1], p2[1]) + diff]);
        results.push([p1[0], Math.min(p1[1], p2[1]) - diff]);
    }
    // Diagonal p1: bottom right, p2: top left
    else if (p1[0] > p2[0] && p1[1] > p2[1]) {
        results.push([p1[0] - diff, p1[1] - diff]);
        results.push([p1[0] + diff, p1[1] + diff]);
    }
    // Diagonal p1: top right, p2: bottom left
    else if (p1[0] > p2[0] && p1[1] < p2[1]) {
        results.push([p1[0] + diff, p1[1] - diff]);
        results.push([p1[0] - diff, p1[1] + diff]);
    }
    // Diagonal p1: top left, p2: bottom right
    else if (p1[0] < p2[0] && p1[1] < p2[1]) {
        results.push([p1[0] - diff, p1[1] - diff]);
        results.push([p1[0] + diff, p1[1] + diff]);
    }
    // Diagonal p1: bottom left, p2: top right
    else if (p1[0] < p2[0] && p1[1] > p2[1]) {
        results.push([p1[0] + diff, p1[1] - diff]);
        results.push([p1[0] - diff, p1[1] + diff]);
    }

    return results.filter(r => !isOutOfBounds(r, map));
}