import { hrtime } from 'node:process';
import * as R from 'ramda';

const year = 2025;
const day = 2;

// problem: https://adventofcode.com/2025/day/2

const inputToRanges = (input: string) => {
  return input.split(',').map((range) => {
    const [start, end] = range.split('-').map(Number);
    return { start, end };
  });
};

function* repeatingHalves(start: number, end: number, maxK: number): Generator<number> {
  // maxK is the maximum number of digits in the first half of the numbers to generate
  if (maxK > 8) {
    // exceeds safe integer range for JS/TS
    throw new Error('maxK is too large');
  }
  for (let k = 1; k <= maxK; k++) {
    const multiplier = 10 ** k + 1;
    const minHalf = 10 ** (k - 1); // smallest k-digit number (e.g., 10 for k=2)
    const maxHalf = 10 ** k - 1; // largest k-digit number (e.g., 99 for k=2)

    // Clamp to range
    const loHalf = Math.max(minHalf, Math.ceil(start / multiplier));
    const hiHalf = Math.min(maxHalf, Math.floor(end / multiplier));

    for (let h = loHalf; h <= hiHalf; h++) {
      yield h * multiplier;
    }
  }
}

const aoc2025_day2_part1 = async (input: string, ...params: any[]) => {
  const startTime = process.hrtime();
  const ranges = inputToRanges(input);
  // find the highest upper bound in the ranges
  const MaxUpperBound = ranges.reduce((max, range) => Math.max(max, range.end), 0);
  // the maximum number of digits in the first half of the numbers
  const maxK = Math.ceil(Math.log10(MaxUpperBound + 1) / 2);

  let sum = 0;
  for (const range of ranges) {
    for (const num of repeatingHalves(range.start, range.end, maxK)) {
      sum += num;
    }
  }

  const endTime = process.hrtime(startTime);
  console.log(`Y${year} D${day} P1 Time taken: ${endTime[0]}s ${endTime[1] / 1000000}ms`);

  return sum;
};

function* repeatingPatterns(start: number, end: number, maxK: number): Generator<number> {
  const seen = new Set<number>();

  for (let k = 1; k <= maxK; k++) {
    const minUnit = 10 ** (k - 1);
    const maxUnit = 10 ** k - 1;

    const maxRepetitions = Math.floor(15 / k);

    for (let repetitions = 2; repetitions <= maxRepetitions; repetitions++) {
      const multiplier = (10 ** (k * repetitions) - 1) / (10 ** k - 1);

      const loUnit = Math.max(minUnit, Math.ceil(start / multiplier));
      const hiUnit = Math.min(maxUnit, Math.floor(end / multiplier));

      for (let h = loUnit; h <= hiUnit; h++) {
        const num = h * multiplier;
        if (!seen.has(num)) {
          seen.add(num);
          yield num;
        }
      }
    }
  }
}

const aoc2025_day2_part2 = async (input: string, ...params: any[]) => {
  const startTime = process.hrtime();
  const ranges = inputToRanges(input);
  // find the highest upper bound in the ranges
  const MaxUpperBound = ranges.reduce((max, range) => Math.max(max, range.end), 0);
  // The highest number of repeated digits needed is half the number
  // of digits in the highest upper bound of the ranges
  const maxK = Math.ceil(Math.log10(MaxUpperBound + 1) / 2);

  let sum = 0;
  for (const range of ranges) {
    for (const num of repeatingPatterns(range.start, range.end, maxK)) {
      sum += num;
    }
  }

  const endTime = process.hrtime(startTime);
  console.log(`Y${year} D${day} P2 Time taken: ${endTime[0]}s ${endTime[1] / 1000000}ms`);

  return sum;
};

export default {
  year,
  day,
  part1: aoc2025_day2_part1,
  part2: aoc2025_day2_part2,
};
