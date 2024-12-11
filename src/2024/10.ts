type Position = [number, number];

type Trail = {
  base: [number, number],
  trailheads: Set<Position>,
}

type TMap = number[][];

export function findBases(map: TMap): Trail[] {
  return map.reduce((acc, row, y) => {
    const positions = row.reduce((pacc, value, x) => {
      if (value === 0) pacc.push([x,y]);
      return pacc;
    }, [] as Position[]);

    acc.push(...positions.map<Trail>(p => ({
      base: p,
      trailheads: new Set(),
    })));

    return acc;
  }, [] as Trail[]);
}

function isOutOfBounds(position: Position, map: TMap): boolean {
  return position[0] < 0 || position[1] < 0 || position[0] >= map[0].length || position[1] >= map.length;
}

function getNextPossibleMovements(map: TMap, position: Position, level: number): Position[] {
  const result = ([
    [position[0], position[1]+1],
    [position[0], position[1]-1],
    [position[0]+1, position[1]],
    [position[0]-1, position[1]],
  ] as Position[]).filter(p => {
    if (isOutOfBounds(p, map)) return false;
    return map[p[1]][p[0]] === level + 1;
  });

  return result;
}

export function solveTrail(trail: Trail, map: TMap): void {
  let currentLevel = 0;
  let nextSteps: Position[] = [trail.base];
  do {
    let s = nextSteps.map(step => getNextPossibleMovements(map, step, currentLevel));
    nextSteps = s.flat();
  } while (++currentLevel <= 9 && nextSteps.length > 0)

  nextSteps.forEach(p => trail.trailheads.add(p));
}

export function parseMap(input: string): TMap {
  return input.split('\n').map(row => row.split('').map(character => parseInt(character, 10)));
}