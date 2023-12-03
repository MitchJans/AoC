import { head, tail } from '@utils/array-util';
import { parseDigitsFromString } from '@utils/parse-digits-from-string';
import { readFileAsLines } from '@utils/read-file-as-lines';

console.log('-- AOC 2023 - Day 1, part 2 --');

const entries = await readFileAsLines({ year: 2023, day: 1, parser: String });

export const aoc2023d1p2 = () => {
  const nums = entries.map((entry) => {
    const digits = parseDigitsFromString({ str: entry, processTextual: true });
    if (!digits) {
      return 0;
    }
    const digitVal = parseInt(`${head(digits)}${tail(digits)}`);
    return digitVal;
  });

  const sum = nums.reduce((acc, curr) => {
    return acc + curr;
  }, 0);

  return sum;
};

console.log(`Solution is: ${aoc2023d1p2()}`);
