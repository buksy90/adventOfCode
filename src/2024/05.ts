type Rule = [number, number];
type Update = number[];

export function findBrokenRule(rules: Rule[], update: Update): null | number {
  for(let ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
    const rule = rules[ruleIndex];
    const leadingPageIndex = update.findIndex(u => u === rule[0]);
    const trailingPageIndex = update.findIndex(u => u === rule[1]);
    const doesRuleApply = leadingPageIndex >= 0 && trailingPageIndex >= 0;

    if (doesRuleApply) {
      const isMet = leadingPageIndex < trailingPageIndex;
      if (isMet === false) return ruleIndex;
    }
  };

  return null;
}

export function getUpdateMiddle(update: Update): number {
  const middleIndex = Math.floor(update.length / 2);
  return update[middleIndex];
}

export function fixUpdate(rules: Rule[], update: Update): Update {
  const copy = [...update];
  copy.sort((a, b) => {
    // Find rule describing current set reversed f(b,a)
    // If theres any, then we need to swap the numbers
    const brokenRule = rules.find(r => r[0] === b && r[1] === a);
    // Find rule describing current set
    // If theres any then no change expected
    // (? for sure??)
    const metRule = rules.find(r => r[0] === a && r[1] === b);

    return brokenRule ? 1 : (metRule ? -1 : 0);
  });

  return copy;
}