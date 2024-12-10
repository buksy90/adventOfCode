export type Equation = { result: number, values: number[] }

export enum Operator1 {
  Add = '+',
  Multiply = '*',
}
export enum Operator2 {
  Add = '+',
  Multiply = '*',
  Concatenation = '||',
}

let operatorsVersion = 1;
function getOperators() {
  switch(operatorsVersion) {
    case 2: return ['+', '*', '||'];
    default:
      return ['+', '*'];
  }
}
type Operator = ReturnType<typeof getOperators>[0];

export function parseEquations(input: string): Equation[] {
  return input.split('\n').map(row => {
    const [ resultString, valuesString ] = row.split(':');
    return {
      result: parseInt(resultString.trim(), 10),
      values: valuesString.trim().split(' ').map(v => parseInt(v.trim(), 10)),
    };
  })
}

function calculateEquation(equation: Equation, operators: Operator[]): number {
  let sum = equation.values[0];
  for(let i = 1; i < equation.values.length; i++) {
    const left = sum;
    const right = equation.values[i];

    sum = operators[i-1] === Operator1.Add
      ? left + right 
      : (operators[i-1] === Operator2.Multiply)
        ? left * right
        : parseInt(`${left}${right}`, 10);
  }

  return sum;
}

export function generateCombinations(length: number): Operator[][] {
  if (length === 1) {
    return [...Object.values(getOperators()).map(v => [v])]
  }

  const lowerLevel = generateCombinations(length-1);
  return Object.values(getOperators())
      .reduce((acc, operator) => {
        return [
          ...acc,
          ...lowerLevel.map(v => [operator, ...v]),
        ];
      }, [] as Operator[][]);
}

const cache = new Map<number, ReturnType<typeof generateCombinations>>();
export function generateCombinationsCached(length: number): ReturnType<typeof generateCombinations> {
  if (!cache.has(length)) {
    cache.set(length, generateCombinations(length));
  }

  return cache.get(length)!;
}

export function getCalibrationResult(equations: Equation[]): number {
  const truthiness = equations.map(testTruthiness);
  return truthiness.reduce((acc, equationOperators, index) => {
    return equationOperators !== false
      ? acc + equations[index].result
      : acc;
  }, 0);
}

export function testTruthiness(equation: Equation): Operator[] | false {
  const allOperators = generateCombinationsCached(equation.values.length - 1);
  for(const operators of allOperators) {
    //console.log(operators);
    if(equation.result === calculateEquation(equation, operators)) {
      //console.log('GOT IT');
      return operators;
    }
  }

  return false;
}

export function testTruthinessBroken(equation: Equation): Operator[] | false {
  const operators: Operator[] = (new Array(equation.values.length - 1)).fill(Operator1.Add);
  const opValues = Object.values(getOperators());
  const opCount = opValues.length;
  for(let i = equation.values.length-2; i >= 0; i--) {
    for(let k = equation.values.length-2; k >= i; k--) {
      for(let o = 0; o < opCount; o++) {
        operators[k] = opValues[o];

        if(equation.result === calculateEquation(equation, operators)) {
          console.log('GOT IT');
          return operators;
        }
      }
    }
  }

  return false;
}

export function setOperators(version: number): void {
  operatorsVersion = version;

  // Reset cache !
  cache.clear();
}