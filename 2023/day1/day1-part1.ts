import { head, tail } from '@utils/array-util';
import { parseDigitsFromString } from '@utils/parse-digits-from-string';
import { readFileAsLines } from '@utils/read-file-as-lines';

console.log('-- AOC 2023 - Day 1, part 1 --');

const entries = await readFileAsLines({ year: 2023, day: 1, parser: String });

export const aoc2023d1p1 = () => {
  const nums = entries.map((entry) => {
    const digits = parseDigitsFromString({ str: entry, processTextual: false });
    if (!digits) {
      return 0;
    }
    return parseInt((head(digits) ?? '') + (tail(digits) ?? ''));
  });

  const sum = nums.reduce((prev, curr) => {
    return prev + curr;
  }, 0);

  return sum;
};

console.log(`Solution is: ${aoc2023d1p1()}`);
