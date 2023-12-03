import { expect, test } from 'bun:test';
import { parseDigitsFromString } from './parse-digits-from-string';

test('should correctly parse digits from a string, including "overlapping" texts', () => {
  // given
  const input = 'dh13kjoneight0'; // oneight 'overlaps'
  const expected = ['1', '3', '1', '8', '0'];
  //when
  const actual = parseDigitsFromString(input);
  //then
  expect(actual).toStrictEqual(expected);
});
