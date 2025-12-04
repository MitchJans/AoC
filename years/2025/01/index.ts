import path from 'path';
import * as R from 'ramda';
const cwd = import.meta.dir;

const year = 2025;
const day = 1;

const inputFilePath = path.join(cwd, 'input.txt');
const input = await Bun.file(inputFilePath).text();

// problem: https://adventofcode.com/2025/day/1

const aoc2025_day1_part1 = async (input: string, ...params: any[]) => {
  const inputLines = input.split('\n');
  // The dial starts at position 50
  let position = 50;
  let zeroCount = 0;

  for await (const line of inputLines) {
    const steps = parseInt(line.slice(1));
    const direction = line[0] === 'L' ? -1 : 1;

    position = (((position + direction * steps) % 100) + 100) % 100;

    if (position === 0) {
      zeroCount++;
    }
  }
  return zeroCount;
};

const aoc2025_day1_part2 = async (input: string, ...params: any[]) => {
  return 'Not implemented';
};

const sol1 = await aoc2025_day1_part1(input);
console.log('part 1 solution:', sol1);

const sol2 = await aoc2025_day1_part2(input);
console.log('part 2 solution:', sol2);
