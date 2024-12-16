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
  const uniqueTrails: Position[][] = [];
  do {
    let s = nextSteps.map(step => getNextPossibleMovements(map, step, currentLevel));
    const flat = s.flat();
    const uniqueSet = new Set(flat.map(v => `${v[0]},${v[1]}`));
    const unique = Array.from(uniqueSet.values()).map<Position>(v => v.split(',').map(d => parseInt(d)) as any);
    nextSteps = unique;
  } while (++currentLevel < 9 && nextSteps.length > 0)

  nextSteps.forEach(p => trail.trailheads.add(p));
}

export function solveTrailTracing(inputTrail: Trail, map: TMap): Position[][] {
  let currentLevel = 0;
  let nextSteps: Position[] = [inputTrail.base];
  const uniqueTrails: Position[][] = [[inputTrail.base]];
  do {
    const newTrails: Position[][] = [];
    for(const trail of uniqueTrails) {
      const nextSteps = getNextPossibleMovements(map, trail[trail.length - 1], currentLevel);
      if (nextSteps.length) {
        const firstResult = nextSteps.pop()!;
        nextSteps.forEach((step) => {
          newTrails.push([...trail, step]);
        });
        trail.push(firstResult);
      } else {
        trail.length = 0;
      }
    }

    uniqueTrails.push(...newTrails);
    for(let i = 0; i < uniqueTrails.length; ) {
      if (uniqueTrails[i].length === 0) {
        uniqueTrails.splice(i, 1);
      } else i++;
    }
  } while (++currentLevel < 9 && nextSteps.length > 0)

  nextSteps.forEach(p => inputTrail.trailheads.add(p));

  return uniqueTrails;
}

export function parseMap(input: string): TMap {
  return input.trim().split('\n').map(row => row.split('').map(character => parseInt(character, 10)));
}

export function solveAllTrails(trails: Trail[], map: TMap): void {
  for(const trail of trails) {
    solveTrail(trail, map);
  }
}

export function scoreTrailheads(trails: Trail[]): number {
  let sum = 0;
  for(const trail of trails) {
    sum += trail.trailheads.size;
  }

  return sum;
}

export function draw(antinodes: Position[], mapDimensions: readonly [number, number]): number[][] {
  const map = (new Array(mapDimensions[1])).fill(null).map(() => (new Array(mapDimensions[0]).fill('.')));
  for(const antinode of antinodes)
      map[antinode[1]][antinode[0]] = '#';

  return map;
}