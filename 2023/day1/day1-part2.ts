import { parseDigitsFromString } from '@utils/parse-digits-from-string';
import { readFileAsLines } from '@utils/read-file-as-lines';

console.log('-- AOC 2023 - Day 1, part 2 --');

const entries = await readFileAsLines({ year: 2023, day: 1, parser: String });

const nums = entries.map((entry) => {
  const digits = parseDigitsFromString(entry);
  console.log(digits);
  if (!digits) {
    return 0;
  }
  const digitVal = parseInt(`${digits[0]}${digits[digits.length - 1]}`);
  return digitVal;
});

const sum = nums.reduce((acc, curr) => {
  return acc + curr;
}, 0);

console.log(`Solution is: ${sum}`);
