const year = 2025;
const day = 3;

// problem: https://adventofcode.com/2025/day/3

function* charactersInString(str: string) {
  for (let i = 0; i < str.length; i++) {
    yield { idx: i, char: str[i] };
  }
  return;
}

// Finds the left-most occurrence of the highest digit in a string and returns the character and index
const findHighestDigit = (str: string) => {
  let highestChar = str[0];
  let highestIdx = 0;

  // start at 1 because we don't need to check the first character against itself
  for (let i = 1; i < str.length; i++) {
    const char = str[i];
    const digit = parseInt(char);
    if (digit > Number(highestChar)) {
      highestIdx = i;
      highestChar = char;
    }
    if (digit === 9) {
      break;
    }
  }

  return { char: highestChar, idx: highestIdx };
};

// fined the highest numerical string value that can be created by concatenating 2 digits from the input string, without rearranging the digits
const aoc2025_day3_part1 = async (input: string, ...params: any[]) => {
  // INITIAL SOLUTION
  // const startTime = process.hrtime();

  // const inputLines = input.split('\n');

  // let result = 0;
  // for (const line of inputLines) {
  //   // Find highest from left (excluding last char)
  //   const { char: leftChar, idx: leftIdx } = findHighestDigit(line.slice(0, -1));

  //   // Find highest from right in remaining portion (reversed)
  //   const restOfLine = line.slice(leftIdx + 1);
  //   const reversedRest = restOfLine.split('').reverse().join('');
  //   const { char: rightChar } = findHighestDigit(reversedRest);

  //   console.table({ leftChar, rightChar });
  //   const lineResult = Number(`${leftChar}${rightChar}`);
  //   result += lineResult;
  // }

  // const endTime = process.hrtime(startTime);
  // console.log(`Y${year} D${day} P1 Time taken: ${endTime[0]}s ${endTime[1] / 1000000}ms`);

  // return result;

  // REFACTORED SOLUTION, only iterates once per line
  const startTime = process.hrtime();

  const inputLines = input.split('\n');

  let result = 0;
  for (const line of inputLines) {
    let left = 0;
    let right = 0;
    for (let i = 0; i < line.length; i++) {
      const current = +line[i];
      if (current > left && i !== line.length - 1) {
        left = current;
        right = 0;
      } else if (current > right) {
        right = current;
      }
    }

    result += left * 10 + +right;
  }

  const endTime = process.hrtime(startTime);
  console.log(`Y${year} D${day} P1 Time taken: ${endTime[0]}s ${endTime[1] / 1000000}ms`);

  return result;
};

// fined the highest numerical string value that can be created by concatenating 12 digits from the input string, without rearranging the digits
const aoc2025_day3_part2 = async (input: string, ...params: any[]) => {
  const startTime = process.hrtime();

  const result = await 'Not implemented';

  const endTime = process.hrtime(startTime);
  console.log(`Y${year} D${day} P2 Time taken: ${endTime[0]}s ${endTime[1] / 1000000}ms`);

  return result;
};

export default {
  year,
  day,
  part1: aoc2025_day3_part1,
  part2: aoc2025_day3_part2,
};
