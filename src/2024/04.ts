const PATTERN = ['X', 'M', 'A', 'S'];
const moveSteps = (new Array(PATTERN.length - 1)).fill(null);
type Position = [number, number];
type Board = string[][];
type Movement = (position: Position) => Position;

export function selectHorizontal(board: Board, start: Position): string[] {
  return select(board, start, moveSteps.map(() => right));
}

export function selectHorizontalInverse(board: Board, start: Position): string[] {
  return select(board, start, moveSteps.map(() => left));
}

export function selectVertical(board: Board, start: Position): string[] {
  return select(board, start, moveSteps.map(() => down));
}

export function selectVerticalInverse(board: Board, start: Position): string[] {
  return select(board, start, moveSteps.map(() => up));
}

export function selectDiagonalRightDown(board: Board, start: Position): string[] {
  return select(board, start, moveSteps.map(() => ((v) => down(right(v)))));
}

export function selectDiagonalLeftUp(board: Board, start: Position): string[] {
  return select(board, start, moveSteps.map(() => ((v) => up(left(v)))));
}

export function selectDiagonalRightUp(board: Board, start: Position): string[] {
  return select(board, start, moveSteps.map(() => ((v) => right(up(v)))));
}

export function selectDiagonalLeftDown(board: Board, start: Position): string[] {
  return select(board, start, moveSteps.map(() => ((v) => left(down(v)))));
}

function selectSingle(board: Board, position: Position): string {
  return board[position[1]][position[0]];
}

function select(board: Board, position: Position, operations: Movement[]): string[] {
  try {
    const selected: string[] = [selectSingle(board, position)];
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