import { stringToLines } from '@utils/solution.utils';

const year = 2025;
const day = 1;

// problem: https://adventofcode.com/2025/day/1

const DIAL_SIZE = 100;
const START_POSITION = 50;

const aoc2025_day1_part1 = async (input: string, ...params: any[]) => {
  const inputLines = stringToLines(input);
  let position = START_POSITION;
  let zeroCount = 0;

  for (const line of inputLines) {
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
  const inputLines = stringToLines(input);
  let position = START_POSITION;
  let zeroCount = 0;

  for (const line of inputLines) {
    const steps = parseInt(line.slice(1));
    const direction = line[0] === 'L' ? -1 : 1;

    // count the number of times the dial crosses 0
    if (direction === 1) {
      zeroCount += Math.floor((position + steps) / DIAL_SIZE);
    } else {
      const stepsToFirstZero = position || DIAL_SIZE;
      if (steps >= stepsToFirstZero) {
        zeroCount += 1 + Math.floor((steps - stepsToFirstZero) / DIAL_SIZE);
      }
    }

    // update the position of the dial
    position =
      direction === 1
        ? //
          (position + steps) % DIAL_SIZE
        : //
          (((position - steps) % DIAL_SIZE) + DIAL_SIZE) % DIAL_SIZE;
  }

  return zeroCount;
};

export default {
  year,
  day,
  part1: aoc2025_day1_part1,
  part2: aoc2025_day1_part2,
};
