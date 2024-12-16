type Position = [number, number];

type Trace = Position[];

type TMap = string[][];

function isOutOfBounds(position: Position, map: TMap): boolean {
  return position[0] < 0 || position[1] < 0 || position[0] >= map[0].length || position[1] >= map.length;
}

function getNextPossibleMovements(map: TMap, trace: Trace): Position[] {
  const current = trace[trace.length - 1];
  const result = ([
    [current[0], current[1]+1],
    [current[0], current[1]-1],
    [current[0]+1, current[1]],
    [current[0]-1, current[1]],
  ] as Position[])
  // Filter out out of bounds
  .filter(p => !isOutOfBounds(p, map))
  // Filter not steppable
  .filter(p => map[p[1]][p[0]] != '#')
  // Filter out already taken positions
  .filter(p1 => !trace.some(p2 => p1[0] === p2[0] && p1[1] === p2[1]));

  return result;
}

function findCharacter(map: TMap, char: string): Position {
  for(let y = 0; y < map.length; y++) {
    for(let x = 0; x < map[0].length; x++) {
      if(map[y][x] === char) return [x,y];
    }
  }

  return [-1, -1];
}

function assertSamePos(p1: Position, p2: Position): boolean {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

export function findAllTraces(map: TMap): Trace[] {
  const start = findCharacter(map, 'S');
  const end = findCharacter(map, 'E');
  const found: Position[][] = [];
  const possible: Position[][] = [[start]];
  let iteration = 0;
  do {
    const newTraces: Position[][] = [];
    for(const trace of possible) {
      const nextSteps = getNextPossibleMovements(map, trace);
      if (nextSteps.length) {
        const firstResult = nextSteps.pop()!;
        nextSteps.forEach((step) => {
          newTraces.push([...trace, step]);
        });
        trace.push(firstResult);
      } else {
        trace.length = 0;
      }
    }

    possible.push(...newTraces);
    for(let i = 0; i < possible.length; ) {
      if (possible[i].length === 0) {
        possible.splice(i, 1);
      } else i++;
    }


    // Remove finished
    for(let i = possible.length - 1; i >= 0; i--) {
      const trace = possible[i];

      if (trace.length > 1) {
        const lastStep = trace[trace.length - 1];
        if(assertSamePos(lastStep, end)) {
          found.push(...possible.splice(i, 1));
        }
      }
    }
  } while (++iteration < 100 && possible.length > 0)

  return found;
}

export function parseMap(input: string): TMap {
  return input.trim().split('\n').map(row => row.split(''));
}