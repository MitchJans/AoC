// Matches 0-9 or a textual representation of digits
const digitRegex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;

const intMap: Record<string, string> = {
  '0': '0',
  zero: '0',
  '1': '1',
  one: '1',
  '2': '2',
  two: '2',
  '3': '3',
  three: '3',
  '4': '4',
  four: '4',
  '5': '5',
  five: '5',
  '6': '6',
  six: '6',
  '7': '7',
  seven: '7',
  '8': '8',
  eight: '8',
  '9': '9',
  nine: '9',
};

/**
 * Gets all digits (see regex above) from a string as a string array.
 * Takes into account 'overlapping' text representations
 * @example
 * 'dh13kjoneight0' // ['1', '3', '1', '8', '0']
 */
export const parseDigitsFromString = (str: string) =>
  Array.from(str.matchAll(digitRegex), (x) => x[1]).map((it) => intMap[it]);
