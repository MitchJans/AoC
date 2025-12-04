import path from 'path';
import { fetch } from 'bun';
import env from './env.ts';

// Sets up challenges and inputs for missing days/years

// Since 2025, AoC runs from dec 1st to dec 12th.
// there is a challenge each day and each challenge has 2 parts.
// The 2 parts each have a different challenge, but they share the same input.

// Abs path to the directory of the current file
const cwd = import.meta.dir;
// Durrrr
const today = new Date();
const currentYear = today.getFullYear();
const currentDay = today.getDate();
// AoC challenges have 2 parts
const parts = ['01', '02'] as const;

// I set this up in 2025, so we will start with 2025
const startYear = 2025;
// fill an array of years from 2025 to the current year
const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
// Since 2025, Advent of Code runs for 12 days from dec 1st through dec 12th
const days = Array.from({ length: 12 }, (_, i) => i + 1);

const getDataPath = (year: string, day: string): string => {
  // left-pad the day so it is always 2 chars long
  const paddedDay = day.toString().padStart(2, '0');
  return path.join(cwd, 'years', year, paddedDay);
};

// Actually run this biz
for (const year of years) {
  for (const day of days) {
    // Solution template replacements
    const replacements = {
      '{YEAR}': String(year),
      '{DAY}': String(day),
      '{PROBLEM_URL}': `https://adventofcode.com/${year}/day/${day}`,
    };

    await new Promise((resolve) => setTimeout(resolve, 250)); // Wait a bit to reduce spam
    if (day > currentDay) {
      break; // stop if we've passed the current day, these challenges are not yet available
    }
    // The directory for the year and day
    const dir = getDataPath(year.toString(), day.toString());

    // Write the TS file to put the solution into
    const solutionTemplatePath = path.join(cwd, 'init_utils', 'skeleton.ts.dat');
    let templateContent = await Bun.file(solutionTemplatePath).text();
    const solutionFilePath = path.join(dir, 'index.ts'); // index is a stupid name, but it's the default entry point¯\_(ツ)_/¯
    if (!(await Bun.file(solutionFilePath).exists())) {
      for (const [key, value] of Object.entries(replacements)) {
        console.log(`Replacing ${key} with ${value}`);
        templateContent = templateContent.replaceAll(key, value);
      }
      console.log(templateContent);
      await Bun.file(solutionFilePath).write(templateContent);
    }

    // check if input file exists or is empty, if so fetch it from the AoC website
    const inputFilePath = path.join(dir, 'input.txt');
    const inputFile = Bun.file(inputFilePath);
    const inputFileMissing = !(await inputFile.exists());
    const inputFileIsEmpty = !inputFileMissing && inputFile.size === 0;
    if (inputFileMissing || inputFileIsEmpty) {
      console.log(`Input for ${year} day ${day} is missing or empty, fetching from AoC website...`);
      const res = await fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
        headers: {
          Cookie: `session=${env.aocSessionCookie}`,
        },
      });
      if (res.ok) {
        console.log(`Fetched input for ${year} day ${day}`);
        await inputFile.write(await res.text());
        console.log(`Wrote input for ${year} day ${day}`);
      } else {
        console.error(`Failed to fetch input for ${year} day ${day}`);
        console.error(`Status: ${res.status}`);
        console.error(`Status Text: ${res.statusText}`);
        console.error(`Body: ${await res.text()}`);
        console.error(`Headers: ${JSON.stringify(res.headers)}`);
        console.error(`Quitting!`);
        process.exit(1);
      }
    } else {
      console.log(`Input for ${year} day ${day} already exists.`);
    }
  }
}
