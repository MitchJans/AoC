const year = 2025;
const day = 1;

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
  const inputLines = input.split('\n').filter((line) => line.trim().length > 0);
  let position = 50;
  let zeroCount = 0;

  for await (const line of inputLines) {
    const steps = parseInt(line.slice(1));
    const direction = line[0] === 'L' ? -1 : 1;

    // Count how many times we hit 0 during this rotation
    const stepsToFirstZero = direction === 1
      ? (position === 0 ? 100 : 100 - position)  // Going right
      : (position === 0 ? 100 : position);       // Going left

    if (steps >= stepsToFirstZero) {
      // We hit 0 once, then every 100 steps after that
      zeroCount += Math.floor((steps - stepsToFirstZero) / 100) + 1;
    }

    // Update position for next iteration
    position = (((position + direction * steps) % 100) + 100) % 100;
  }

  return zeroCount;
};

export default {
  year,
  day,
  part1: aoc2025_day1_part1,
  part2: aoc2025_day1_part2,
};
