// https://adventofcode.com/2024/day/2
const maxSafeStep = 3;
const minSafeStep = 1;

function areStepsSafe(report: number[]): boolean {
  for(let i = 1; i < report.length; i++) {
    const diff = Math.abs(report[i] - report[i-1]);
    if(diff < minSafeStep || diff > maxSafeStep) return false;
  }

  return true;
}

function isReportDecreasing(report: number[]): boolean {
  let current = Number.MAX_VALUE;
  for(let i = 0; i < report.length; i++) {
    if (report[i] < current) current = report[i];
    else return false;
  }

  return true;
}

function isReportIncreasing(report: number[]): boolean {
  let current = Number.MIN_VALUE;
  for(let i = 0; i < report.length; i++) {
    if (report[i] > current) current = report[i];
    else return false;
  }

  return true;
}

export function isSafeReport(report: number[]) {
  return areStepsSafe(report) && (isReportDecreasing(report) || isReportIncreasing(report));
}

export function countSafeReports(reports: number[][]): number {
  const safeResults = reports.map(r => isSafeReport(r));
  return safeResults.filter(v => v === true).length;
}

export function problemDampener(report: number[]): number | null | false {
  const naive = isSafeReport(report);
  if (naive) return null;

  for(let i = 0; i < report.length; i++) {
    const dampedReport = report.filter((_, index) => index != i);
    if(isSafeReport(dampedReport)) {
      return i;
    }
  }

  return false;
}