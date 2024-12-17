type Position = [number, number];
export type Trace = Position[] & { hasMore?: boolean };
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

function hasBeenSeen(traces: Trace[], position: Position, minStep = 0, maxStep = Number.MAX_VALUE): boolean {
  // Following may not be correct, e.g. if position has been seen after
  // same amount of steps then it should be considered as good
  return traces.some(trace => trace.some((p, index) => assertSamePos(p, position) && index < maxStep && index > minStep));
}

const MAX_STEPS = 20000;
const MAX_BRANCHES = 10;
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


    //const visualization = possible.map(trace => draw(trace, map, 130));

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

  console.log(`Possible count is ${possible.length} after ${iteration} iterations`);

  return found;
}

export function parseMap(input: string): TMap {
  return input.trim().split('\n').map(row => row.trim().split(''));
}

export function draw(trace: Trace, map: TMap, cutYLess = 0): TMap {
  const result = map.map(row => row.map(c => c));
  for(const step of trace) {
    result[step[1]][step[0]] = 'X';
  }

  return result.filter((_, y) => y >= cutYLess);
}

function getSurroundings(map: TMap, position: Position): Position[] {
  return [
    [position[0], position[1]+1],
    [position[0], position[1]-1],
    [position[0]+1, position[1]],
    [position[0]-1, position[1]],
  ];
}

function countValue(map: TMap, positions: Position[], invertValue: string): number {
  let result = 0;
  for(const position of positions) {
    result += map[position[1]][position[0]] !== invertValue ? 1 : 0;
  }
  return result;
}

export function eliminateDeadBranch(map: TMap, start: Position): void {
  const trace: Position[] = [start];

  do {
    const nextSteps = getNextPossibleMovements(map, trace);
    if (nextSteps.length !== 1) {
      trace.pop();
      break;
    }
    const nextStepValue = map[nextSteps[0][1]][nextSteps[0][0]];
    if (nextStepValue === 'E' || nextStepValue === 'S') {
      break;
    }

    trace.push(nextSteps[0]);
  } while(trace.length < 100);

  for(const p of trace) {
    map[p[1]][p[0]] = '#';
  }
}

export function eliminateDeadBranches(map: TMap) {
  let eliminated = 1;
  for(let y = 1; y < map.length - 1; y++) {
    for(let x = 1; x < map[0].length - 1; x++) {
      if (map[y][x] !== '.') continue;
      const surroundings = getSurroundings(map, [x,y]);
      const dotsCount = countValue(map, surroundings, '#');

      if (dotsCount === 1) {
        eliminateDeadBranch(map, [x,y]);
        eliminated++;
        console.log(`Eliminated ${x},${y}, count: ${eliminated}`);
      }
    }
  }
}

export function eliminateBadBranch(map: TMap, trace: Trace, traces: Trace[]) {

  for(let i = trace.length - 1; i >= 0; i--) {
    if(hasBeenSeen(traces, trace[i], trace.length - i)) {
      break;
    }

    map[trace[i][1]][trace[i][0]] = '#';
  }
}

export function isReturningInOtherBranch(trace: Trace, traces: Trace[], position = trace[trace.length - 1]): boolean {
  const currentTraceIndex = traces.indexOf(trace);

  const positionBetterIndex = traces.findIndex((trace, traceIndex) => trace.some((p, index) => {
    const isDiffTrace = traceIndex !== currentTraceIndex;
    const isBetterIndex = index < trace.length - 1;
    const isSamePos = assertSamePos(p, position);
    return isDiffTrace && isBetterIndex && isSamePos;
  }));

  return positionBetterIndex !== -1;
}

export function isEquallyGood(trace: Trace, traces: Trace[], position = trace[trace.length - 1]): boolean {
  const currentTraceIndex = traces.indexOf(trace);

  const isAsGood = traces.every((testTrace, traceIndex) => traceIndex === currentTraceIndex || testTrace.some((p, index) => {
    const samePosIndex = testTrace.findIndex(p => assertSamePos(p, position));
    return samePosIndex === -1 || samePosIndex === trace.length - 1;
  }));

  return isAsGood;
}

export function eliminateBadBranches(map: TMap) {
  const start = findCharacter(map, 'S');
  const end = findCharacter(map, 'E');
  const found: Position[][] = [];
  const possible: Position[][] = [[start]];
  const toBeRemoved: Trace[] = [];
  let iteration = 0;
  do {
    const newTraces: Position[][] = [];
    for(const trace of possible) {
      const nextSteps = getNextPossibleMovements(map, trace)
        .filter(next => !isReturningInOtherBranch(trace, possible, next))
      const visualization = possible.map(trace => draw(trace, map));



      // 4
      // 5 - must be less than +0
      if (nextSteps.length === 1 && hasBeenSeen(possible, nextSteps[0],  0, trace.length)) {
        if(map[nextSteps[0][1]][nextSteps[0][0]] === 'E') {
          continue;
        }
        //eliminateBadBranch(map, trace, possible);
        map[trace[trace.length - 1][1]][trace[trace.length - 1][0]] = '#';
        toBeRemoved.push(trace);
      }

      else {
        const nextNewSteps = nextSteps.filter(s => !hasBeenSeen(possible, s, trace.length));
        if (nextNewSteps.length) {
          const firstResult = nextNewSteps.pop()!;
          nextNewSteps.forEach((step) => {
            newTraces.push([...trace, step]);
          });
          trace.push(firstResult);
        } else {
          toBeRemoved.push(trace);
        }
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


    //const visualization = possible.map(trace => draw(trace, map, 130));

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