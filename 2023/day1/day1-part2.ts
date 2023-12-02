import { readFileAsLines } from '@utils/read-file-as-lines';

console.log('-- AOC 2023 - Day 1, part 2 --');

const entries = await readFileAsLines({ year: 2023, day: 1, parser: String });

const intMap: Record<string, string> = {
  '1': '1',
  one: '1',
  '2': '2',
  two: '2',
  '3': '3',
  three: '3',
  '4': '4',
  four: '4',
  '5': '5',
  five: '5',
  '6': '6',
  six: '6',
  '7': '7',
  seven: '7',
  '8': '8',
  eight: '8',
  '9': '9',
  nine: '9',
};

const digitRegex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;
const nums = entries.map((entry) => {
  const digits = Array.from(entry.matchAll(digitRegex), (x) => x[1]);
  if (!digits) {
    return 0;
  }
  const digitVal = parseInt(`${intMap[digits[0]]}${intMap[digits[digits.length - 1]]}`);
  return digitVal;
});

const sum = nums.reduce((acc, curr) => {
  return acc + curr;
}, 0);

console.log(`Solution is: ${sum}`);
