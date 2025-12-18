import { describe, it, expect } from 'vitest';
import solutions from './index.ts';

describe('aoc2025_day2', () => {
  const testInput = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

  it('part 1 test input', async () => {
    const expected = 1227775554;
    const actual = await solutions.part1(testInput);
    expect(actual).toEqual(expected);
  });

  it('part 2 test input', async () => {
    const expected = 4174379265;
    const actual = await solutions.part2(testInput);
    expect(actual).toEqual(expected);
  });
});
