import { readFileAsLines } from '@utils/read-file-as-lines';

console.log('-- AOC 2023 - Day 2, part 1 --');

const entries = await readFileAsLines({ year: 2023, day: 1, parser: String });
