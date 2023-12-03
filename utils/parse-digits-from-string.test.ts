import { expect, test } from 'bun:test';
import { parseDigitsFromString } from './parse-digits-from-string';

test('should correctly parse digits from a string', () => {
  // given
  const input = 'dh13kjoneight0'; // oneight 'overlaps'
  const expected = ['1', '3', '0'];
  //when
  const actual = parseDigitsFromString({ str: input, processTextual: false });
  //then
  expect(actual).toStrictEqual(expected);
});

test('should correctly parse digits from a string, including textual digits texts', () => {
  // given
  const input = 'dh13kjoneight0'; // oneight 'overlaps'
  const expected = ['1', '3', '1', '8', '0'];
  //when
  const actual = parseDigitsFromString({ str: input, processTextual: true });
  //then
  expect(actual).toStrictEqual(expected);
});
