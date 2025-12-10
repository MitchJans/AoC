import { describe, it, expect } from 'vitest';
import solutions from './index.ts';

describe('aoc2025_day1_part1', () => {
  it('should return the correct answer', async () => {
    const testInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
    const expected = 3;
    const actual = await solutions.part1(testInput);
    expect(actual).toEqual(expected);
  });
});

describe('aoc2025_day1_part2', () => {
  it('should return the correct answer', async () => {
    const testInput = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
    const expected = 6;
    const actual = await solutions.part2(testInput);
    expect(actual).toEqual(expected);
  });
});
