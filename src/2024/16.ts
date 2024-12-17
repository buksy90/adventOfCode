type Position = [number, number];
export type Trace = Position[];
export type TMap = string[][];

function isOutOfBounds(position: Position, map: TMap): boolean {
  return position[0] < 0 || position[1] < 0 || position[0] >= map[0].length || position[1] >= map.length;
}

function getOrientation(prev: Position, curr: Position): Orientation {
  if(prev[0] === curr[0] - 1 && prev[1] === curr[1]) return Orientation.East;
  if(prev[0] === curr[0] + 1 && prev[1] === curr[1]) return Orientation.West;
  if(prev[0] === curr[0] && prev[1] === curr[1] + 1) return Orientation.North;
  if(prev[0] === curr[0] && prev[1] === curr[1] - 1) return Orientation.South;

  throw new Error('Invalid orientation');
}

export function scoreRotation(trace: Trace, i: number): number {
  const prev = trace[i - 1];
  const current = trace[i];
  const currentRotation = prev ? getOrientation(prev, current) : Orientation.East;
  const prevRotation = i - 2 >= 0 ? getOrientation(trace[i - 2], prev) : Orientation.East;

  if (currentRotation === prevRotation) return 0;

  let clockWiseSteps = 0;
  let clockWiseTest = prevRotation;
  for(;clockWiseTest != currentRotation; clockWiseTest++, clockWiseSteps++) {
    if ((clockWiseTest + 1) % 4 === 0) {
      // @ts-ignore
      clockWiseTest = -1;
    }
  }

  let clockAntiwiseSteps = 0;
  let clockAntiwiseTest = prevRotation;
  for(;clockAntiwiseTest != currentRotation; clockAntiwiseTest--, clockAntiwiseSteps++) {
    if (clockAntiwiseTest === 0) {
      // @ts-ignore
      clockAntiwiseTest = 4;
    }
  }

  return Math.min(clockWiseSteps, clockAntiwiseSteps) * 1000;
}

enum Orientation { East, South, West, North };
export function score(trace: Trace): number {
  let sum = 0;

  for(let i = 1; i < trace.length; i++) {
    const step = 1;
    const rotation = scoreRotation(trace, i);

    sum += step + rotation;
  }

  return sum;
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

function hasBeenSeen(traces: Trace[], position: Position, maxStepsToPosition = 0): boolean {
  // Following may not be correct, e.g. if position has been seen after
  // same amount of steps then it should be considered as good
  return traces.some(trace => trace.some((p, index) => assertSamePos(p, position) && index > maxStepsToPosition));
}

const MAX_STEPS = 1000;
export function findAllTraces(map: TMap): Trace[] {
  const start = findCharacter(map, 'S');
  const end = findCharacter(map, 'E');
  const found: Position[][] = [];
  const possible: Position[][] = [[start]];
  const toBeRemoved: Trace[] = [];
  let iteration = 0;
  do {
    const newTraces: Position[][] = [];
    for(const trace of possible) {
      const nextSteps = getNextPossibleMovements(map, trace);
      const nextNewSteps = nextSteps.filter(s => !hasBeenSeen(possible, s, trace.length));

      if (nextNewSteps.length) {
        const firstResult = nextNewSteps.pop()!;
        nextNewSteps.forEach((step) => {
          newTraces.push([...trace, step]);
        });
        trace.push(firstResult);
      } else {
        trace.length = 0;
        toBeRemoved.push(trace);
      }
    }

    possible.push(...newTraces);

    // Removed blind
    toBeRemoved.reverse();
    for(const toRemove of toBeRemoved) {
      const index = possible.indexOf(toRemove);
      possible.splice(index, 1);
    }
    toBeRemoved.length = 0;


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
  } while (++iteration < MAX_STEPS && possible.length > 0)

  return found;
}

export function parseMap(input: string): TMap {
  return input.trim().split('\n').map(row => row.trim().split(''));
}

export function draw(trace: Trace, map: TMap): TMap {
  const result = map.map(row => row.map(c => c));
  for(const step of trace) {
    result[step[1]][step[0]] = 'X';
  }

  return result;
}