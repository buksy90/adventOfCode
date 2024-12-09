enum Direction {
  Up,
  Right,
  Down,
  Left,
}

type Position = [number, number];
type Area = string[][];
export type Guard = { position: Readonly<Position>, direction: Readonly<Direction> };

function getAreaPart(area: Readonly<Area>, position: Readonly<Position>): string | false {
  try {
    if(position[0] < 0 || position[1] < 0) return false;
    if(position[1] >= area.length || position[0] >= area[position[1]].length) return false;

    return area[position[1]][position[0]]; 
  } catch(e) {
    // Why following does not catch the "-1" access?? :O
    return false;
  }
}

function rotateClockWise(direction: Direction): Direction {
  const rotated = ++direction;
  return rotated > Direction.Left ? Direction.Up : rotated;
}

let stepsCount = 0;
export function resetStepsCount() {
  stepsCount = 0;
}

export function step(area: Area, guard: Guard): Guard | undefined {
  let nextPosition: Position;
  console.log(`${stepsCount}. step ${guard.direction}, ${hashPosition(guard.position)}`);
  if(++stepsCount > 15000) {
    throw new Error('Too many steps');
  }

  switch(guard.direction) {
    case Direction.Up:
      nextPosition = [guard.position[0], guard.position[1] - 1] as const;
      break;
    case Direction.Right:
      nextPosition = [guard.position[0] + 1, guard.position[1]] as const;
      break;
    case Direction.Down:
      nextPosition = [guard.position[0], guard.position[1] + 1] as const;
      break;
    case Direction.Left:
      nextPosition = [guard.position[0] - 1, guard.position[1]] as const;
      break;
    default: throw new Error('Unexpected direction');
  }

  let nextPlace = getAreaPart(area, nextPosition);
  if (nextPlace === false) {
    return undefined;
  }

  return nextPlace === '.'
    ? { ...guard, position: nextPosition }
    : step(area, { ...guard, direction: rotateClockWise(guard.direction) });
}

export function hashPosition(position: Readonly<Position>): string {
  return `x:${position[0]},y:${position[1]}`;
}

export function countRoute(area: Area, startUpGuard: Guard, maxSteps = 5000): number | false {
  let guard: Guard | undefined = startUpGuard;
  let steppedPositions = new Set<string>([hashPosition(startUpGuard.position)]);
  while(guard = step(area, guard)) {
    if(guard === undefined) break;
    
    steppedPositions.add(hashPosition(guard.position));
    if(steppedPositions.size > maxSteps) {
      return false;
    }
  }

  return steppedPositions.size;
}

export function iterateArea(area: Area, cb: (position: Position) => void) {
  for(let y = 0; y < area.length; y++) {
    for(let x = 0; x < area[y].length; x++) {
      console.log(`area ${hashPosition([x,y])}`);
      cb([x,y]);
    }
  }
}
