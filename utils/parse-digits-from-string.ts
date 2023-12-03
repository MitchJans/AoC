// Matches 0-9
const simpleDigitRegex = /\d/g;

// Matches 0-9 or a textual representation of digits
// uses a (?=) lookahead to match overlaps like 'oneight'
const textualDigitRegex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;

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

type ParseDigitsFromString = {
  str: string;
  processTextual?: boolean;
};

/**
 * Gets all digits (0-9) from a string as a string array.
 * If processTextual is `true`, also processes textual representations of digits and
 * takes into account 'overlapping' text representations.
 */
export const parseDigitsFromString = ({ str, processTextual }: ParseDigitsFromString) => {
  if (processTextual) {
    const matches = str.matchAll(textualDigitRegex);
    const matchArr = Array.from(matches, (x) => x[1]);
    const mappedToDigits = matchArr.map((it) => intMap[it]);

    return mappedToDigits;
  } else {
    const digits = str.match(simpleDigitRegex);
    return digits;
  }
};
