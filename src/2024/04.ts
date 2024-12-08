const PATTERN = ['X', 'M', 'A', 'S'];
const moveSteps = (new Array(PATTERN.length - 1)).fill(null);
type Position = [number, number];
type Board = string[][];
type Movement = (position: Position) => Position;

export function iterateBoard(board: Board, cb: (board: Board, position: Position) => void): void {
  for(let y = 0; y < board.length; y++) {
    for(let x = 0; x < board[y].length; x++) {
      cb(board, [x,y]);
    }
  }
}

const allSelectFns = [
  selectHorizontal,
  selectHorizontalInverse,
  selectVertical,
  selectVerticalInverse,
  selectDiagonalLeftDown,
  selectDiagonalLeftUp,
  selectDiagonalRightDown,
  selectDiagonalRightUp,
];
export function selectAllPossible(board: Board, position: Position): string[][] {
  return allSelectFns.map(fn => fn(board, position));
}

export function countMatches(board: Board, position: Position, expected: string): number {
  const matches = selectAllPossible(board, position);
  return matches.filter(m => m.join('') === expected).length;
}

export function selectHorizontal(board: Board, start: Position): string[] {
  return select(board, start, [noMove, right, right, right]);
}

export function selectHorizontalInverse(board: Board, start: Position): string[] {
  return select(board, start, [noMove, left, left, left]);
}

export function selectVertical(board: Board, start: Position): string[] {
  return select(board, start, [noMove, down, down, down]);
}

export function selectVerticalInverse(board: Board, start: Position): string[] {
  return select(board, start, [noMove, up, up, up]);
}

export function selectDiagonalRightDown(board: Board, start: Position): string[] {
  return select(board, start, [noMove, ...moveSteps.map(() => ((v: Position) => down(right(v))))]);
}

export function selectDiagonalLeftUp(board: Board, start: Position): string[] {
  return select(board, start, [noMove, ...moveSteps.map(() => ((v: Position) => up(left(v))))]);
}

export function selectDiagonalRightUp(board: Board, start: Position): string[] {
  return select(board, start, [noMove, ...moveSteps.map(() => ((v: Position) => right(up(v))))]);
}

export function selectDiagonalLeftDown(board: Board, start: Position): string[] {
  return select(board, start, [noMove, ...moveSteps.map(() => ((v: Position) => left(down(v))))]);
}

function selectSingle(board: Board, position: Position): string {
  return board[position[1]][position[0]];
}

function select(board: Board, position: Position, operations: Movement[]): string[] {
  try {
    const selected: string[] = [];
    for(const op of operations) {
      position = op(position);
      selected.push(selectSingle(board, position));
    }

    return selected;
  } catch {
    return [];
  }
}

function right(position: Position): Position {
  return [position[0] + 1, position[1]];
}

function left(position: Position): Position {
  return [position[0] - 1, position[1]];
}

function up(position: Position): Position {
  return [position[0], position[1] - 1];
}

function down(position: Position): Position {
  return [position[0], position[1] + 1];
}

function noMove(position: Position): Position {
  return position;
}


//
// Part two select functions
//
export function selectX1(board: Board, start: Position): string[] {
  return select(board, start, [
    (p) => left(up(p)),
    (p) => down(right(p)),
    (p) => down(right(p)),
  ]);
}
export function selectX2(board: Board, start: Position): string[] {
  return select(board, start, [
    (p) => down(right(p)),
    (p) => left(up(p)),
    (p) => left(up(p)),
  ]);
}
export function selectX3(board: Board, start: Position): string[] {
  return select(board, start, [
    (p) => right(up(p)),
    (p) => left(down(p)),
    (p) => left(down(p)),
  ]);
}
export function selectX4(board: Board, start: Position): string[] {
  return select(board, start, [
    (p) => left(down(p)),
    (p) => right(up(p)),
    (p) => right(up(p)),
  ]);
}
const allSelectFns2 = [
  selectX1,
  selectX2,
  selectX3,
  selectX4,
];
export function selectAllPossible2(board: Board, position: Position): string[][] {
  return allSelectFns2.map(fn => fn(board, position));
}