const regexValidOperation = /(mul\([0-9]{1,3},[0-9]{1,3}\))|(do\(\))|(don't\(\))/g;
export function filterNonCorrupted(input: string): string[] {
  return input.match(regexValidOperation) || [];
}

export function filterMulOp(input: string[]): string[] {
  return input.filter(v => v.startsWith('mul'));
}

export function filterEnabled(input: string[]): string[] {
  let isEnabled = true;
  return input.filter(v => {
    if(v === 'do()') {
      isEnabled = true;
      return false;
    }
    else if(v === 'don\'t()') {
      isEnabled = false;
      return false;
    } 
    else return isEnabled;
  });
}

const regexOperationArguments = /mul\(([0-9]{1,3}),([0-9]{1,3})\)/;
function multiply(input: string): number {
  const args = (input.match(regexOperationArguments) || []).map(v => parseInt(v, 10));
  return args[1] * args[2];
}

export function calculate(operations: string[]): number {
  const operationsResults = operations.map(multiply);
  return operationsResults.reduce((result, v) => result + v, 0);
}