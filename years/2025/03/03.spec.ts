import { describe, it, expect } from 'vitest';
import solutions from './index.ts';

describe('aoc2025_day3', () => {
  const testInput = `987654321111111
  811111111111119
  234234234234278
  818181911112111`;

  it('part 1 test input', async () => {
    const expected = 357;
    const actual = await solutions.part1(testInput);
    expect(actual).toEqual(expected);
  });

  it('part 2 test input', async () => {
    const expected = 4174379265;
    const actual = await solutions.part2(testInput);
    expect(actual).toEqual(expected);
  });
});
