const year = 2025;
const day = 3;

// problem: https://adventofcode.com/2025/day/3

function* charactersInString(str: string) {
  for (let i = 0; i < str.length; i++) {
    yield { idx: i, char: str[i] };
  }
  return;
}

const aoc2025_day3_part1 = async (input: string, ...params: any[]) => {
  const startTime = process.hrtime();

  const inputLines = input.split('\n');

  let result = 0;
  for (const line of inputLines) {
    // init tracking vars
    let leftHighestIdx = 0;
    let leftChar = line[0];
    // also start at zero because we will reverse the string for searching RTL
    let rightHighestIdx = 0;
    let rightChar = line[line.length - 1];

    for (const { idx, char } of charactersInString(line.slice(0, -1))) {
      const digit = parseInt(char);
      if (digit > Number(leftChar)) {
        leftHighestIdx = idx;
        leftChar = char;
      }
      if (digit === 9) {
        break;
      }
    }

    const restOfLine = line.slice(leftHighestIdx + 1);
    const reversedRestOfLine = restOfLine.split('').reverse().join('');
    for (const { idx, char } of charactersInString(reversedRestOfLine)) {
      const digit = parseInt(char);
      if (digit > Number(rightChar)) {
        rightHighestIdx = idx;
        rightChar = char;
      }
      if (digit === 9) {
        break;
      }
    }

    console.table({ leftChar, rightChar });
    const lineResult = Number(`${leftChar}${rightChar}`);
    result += lineResult;
  }

  const endTime = process.hrtime(startTime);
  console.log(`Y${year} D${day} P1 Time taken: ${endTime[0]}s ${endTime[1] / 1000000}ms`);

  return result;
};

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
