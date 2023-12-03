import { expect, test, describe } from 'bun:test';
import { aoc2023d1p1 } from './day1-part1';
import { aoc2023d1p2 } from './day1-part2';

describe('aoc 2023 day 1', () => {
  test('day 1 part 1', () => {
    expect(aoc2023d1p1()).toStrictEqual(55971);
  });

  test('day 1 part 2', async () => {
    expect(aoc2023d1p2()).toStrictEqual(54719);
  });
});
