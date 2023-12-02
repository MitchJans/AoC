import { readFileAsLines } from '@utils/read-file-as-lines';

console.log('-- AOC 2023 - Day 1, part 1 --');

const entries = await readFileAsLines({ year: 2023, day: 1, parser: String });

const digitRegex = /\d/g;
const nums = entries.map((entry) => {
  const digits = entry.match(digitRegex);
  if (!digits) {
    return 0;
  }
  return parseInt(digits[0] + digits[digits.length - 1]);
});

const sum = nums.reduce((prev, curr) => {
  return prev + curr;
}, 0);

console.log(`Solution is: ${sum}`);
