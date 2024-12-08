export function listsDistance(a: number[], b: number[]) {
  a.sort();
  b.sort();

  let sum = 0;
  for(let i = 0; i < a.length; i++) {
    sum += Math.abs(a[i] - b[i]);
  }

  return sum;
}

export function listsSimilarity(a: number[], b: number[]) {
  a.sort();
  b.sort();

  let sum = 0;
  for(let i = 0; i < a.length; i++) {
    const target = a[i];
    const amountInB = b.filter(v => v === target).length;

    sum += target * amountInB;
  }

  return sum;
}