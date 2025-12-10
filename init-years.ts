import path from 'path';

import chalk from 'chalk';
import boxen from 'boxen';
import { macchiato } from './utils/output_colors.ts';
import { aocClient } from '@utils/aoc-client.ts';

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

// Welcome banner
const welcomeBanner = boxen(chalk.hex(macchiato.lavender).bold('🎄 Advent of Code Initializer 🎄'), {
  padding: 1,
  borderColor: macchiato.blue,
  borderStyle: 'round',
  textAlignment: 'center',
});
console.log(welcomeBanner);

// Actually run this biz
for (const year of years) {
  for (const day of days) {
    const paddedDay = day.toString().padStart(2, '0');
    // Solution template replacements
    const replacements = {
      '{YEAR}': String(year),
      '{DAY}': String(day), // this is a number var, so no need to pad
      '{PROBLEM_URL}': `https://adventofcode.com/${year}/day/${day}`,
    };

    await new Promise((resolve) => setTimeout(resolve, 250)); // Wait a bit to reduce spam
    if (day > currentDay) {
      break; // stop if we've passed the current day, these challenges are not yet available
    }
    // The directory for the year and day
    const dir = getDataPath(year.toString(), paddedDay);

    // Header for this day
    const dayHeader = boxen(chalk.hex(macchiato.blue).bold(`Year ${year} - Day ${paddedDay}`), {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      borderColor: macchiato.blue,
      borderStyle: 'round',
    });
    console.log(dayHeader);

    // Write the TS file to put the solution into
    const solutionTemplatePath = path.join(cwd, 'init_utils', 'skeleton.ts.dat');
    let templateContent = await Bun.file(solutionTemplatePath).text();
    const solutionFilePath = path.join(dir, 'index.ts'); // index is a stupid name, but it's the default entry point¯\_(ツ)_/¯
    const solutionExists = await Bun.file(solutionFilePath).exists();

    if (!solutionExists) {
      for (const [key, value] of Object.entries(replacements)) {
        templateContent = templateContent.replaceAll(key, value);
      }
      await Bun.file(solutionFilePath).write(templateContent);
      console.log(
        chalk.hex(macchiato.green)('✓') +
          chalk.hex(macchiato.text)(' Skeleton generated: ') +
          chalk.hex(macchiato.teal)(solutionFilePath),
      );
    } else {
      console.log(
        chalk.hex(macchiato.yellow)('○') +
          chalk.hex(macchiato.text)(' Skeleton already exists: ') +
          chalk.hex(macchiato.teal)(solutionFilePath),
      );
    }

    // check if input file exists or is empty, if so fetch it from the AoC website
    const inputFilePath = path.join(dir, 'input.txt');
    const inputFile = Bun.file(inputFilePath);
    const inputFileMissing = !(await inputFile.exists());
    const inputFileIsEmpty = !inputFileMissing && inputFile.size === 0;

    if (inputFileMissing || inputFileIsEmpty) {
      console.log(chalk.hex(macchiato.peach)('⏳') + chalk.hex(macchiato.text)(' Fetching input...'));
      const res = await aocClient(`${year}/day/${day}/input`);
      if (res.ok) {
        await inputFile.write(await res.text());
        console.log(
          chalk.hex(macchiato.green)('✓') +
            chalk.hex(macchiato.text)(' Input fetched: ') +
            chalk.hex(macchiato.teal)(inputFilePath),
        );
      } else {
        console.error(chalk.hex(macchiato.red).bold('✗ Failed to fetch input'));
        console.error(chalk.hex(macchiato.red)(`Status: ${res.status} ${res.statusText}`));
        console.error(chalk.hex(macchiato.red)(`Body: ${await res.text()}`));
        process.exit(1);
      }
    } else {
      console.log(
        chalk.hex(macchiato.yellow)('○') +
          chalk.hex(macchiato.text)(' Input already exists: ') +
          chalk.hex(macchiato.teal)(inputFilePath),
      );
    }

    // Check to see if we have the problem file, if not fetch it from the AoC website
    const problemFilePath = path.join(dir, 'problem.html');
    const problemFile = Bun.file(problemFilePath);
    const problemFileMissing = !(await problemFile.exists());
    const problemFileIsEmpty = !problemFileMissing && problemFile.size === 0;

    console.log(''); // Empty line between days
  }
}
