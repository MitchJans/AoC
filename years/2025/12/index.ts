import * as R from 'ramda';

const year = 2025;
const day = 12;

// problem: https://adventofcode.com/2025/day/12

const aoc2025_day12_part1 = async (input: string, ...params: any[]) => {
  const startTime = process.hrtime();	
  
	const result = "Not implemented";
  
	const endTime = process.hrtime(startTime);
  console.log(`Y${year} D${day} P1 Time taken: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
  
	return result;
}

const aoc2025_day12_part2 = async (input: string, ...params: any[]) => {
  const startTime = process.hrtime();
  
	const result = "Not implemented";
  
	const endTime = process.hrtime(startTime);
  console.log(`Y${year} D${day} P2 Time taken: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
  
	return result;
}

export default {
	year,
	day,
  part1: aoc2025_day12_part1,
  part2: aoc2025_day12_part2,
};