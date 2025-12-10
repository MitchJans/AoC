import { defineCommand, runMain } from 'citty';
import path from 'path';
import { readdir } from 'fs/promises';
import chalk from 'chalk';
import boxen from 'boxen';
import { macchiato } from './utils/output_colors.ts';

const validateArgs = ({ args }: { args: { year?: string; day?: string; parts?: string } }) => {
  if (args.day && !args.year) {
    console.error('Error: --day requires --year to be specified');
    process.exit(1);
  }

  if (args.parts && !args.day) {
    console.error('Error: --parts requires --day to be specified');
    process.exit(1);
  }
};

const run = async ({ args }: { args: { year?: string; day?: string; parts?: string } }) => {
  validateArgs({ args });

  // Discover years if not provided
  const yearsDir = path.join(process.cwd(), 'years');
  let years: string[];
  if (args.year) {
    years = [args.year];
  } else {
    try {
      const entries = await readdir(yearsDir);
      years = entries.filter((entry) => /^\d{4}$/.test(entry)).sort(); // only get years that are 4 digits
    } catch (error) {
      console.error(`Error reading years directory: ${yearsDir}`);
      console.error(error);
      process.exit(1);
    }
  }

  // Determine what to run
  const days = args.day ? [args.day] : Array.from({ length: 12 }, (_, i) => String(i + 1));
  const defaultParts = ['1', '2'];
  const parts = args.parts ? args.parts.split(',').map((p: string) => p.trim()) : defaultParts;
  if (parts.some((p) => p !== '1' && p !== '2')) {
    console.error('Error: parts must be either "1", "2", or "1,2"');
    process.exit(1);
  }

  // Iterate over years
  for (const year of years) {
    const yearLines: string[] = [year, ''];

    // Iterate over days
    for (const day of days) {
      const paddedDay = day.padStart(2, '0');
      const solutionPath = path.join(process.cwd(), 'years', year, paddedDay, 'index.ts');
      const inputPath = path.join(process.cwd(), 'years', year, paddedDay, 'input.txt');
      console.table({ year, day, paddedDay, solutionPath, inputPath });

      // Check if solution file exists
      const solutionFile = Bun.file(solutionPath);
      const solutionExists = await solutionFile.exists();

      // Check if this date is in the future
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentDay = today.getDate();
      let isFuture = false;
      let solutionModule;
      let solution;

      // If file exists, try to import and check year/day from export
      if (solutionExists) {
        try {
          solutionModule = await import(solutionPath);
          solution = solutionModule.default;
          if (solution && solution.year !== undefined && solution.day !== undefined) {
            isFuture = solution.year > currentYear || (solution.year === currentYear && solution.day > currentDay);
          } else {
            // Fallback to loop variables if export doesn't have year/day
            const solutionYearNum = parseInt(year);
            const solutionDayNum = parseInt(day);
            isFuture =
              solutionYearNum > currentYear || (solutionYearNum === currentYear && solutionDayNum > currentDay);
          }
        } catch (error) {
          // If import fails, use the loop variable check
          const solutionYearNum = parseInt(year);
          const solutionDayNum = parseInt(day);
          isFuture = solutionYearNum > currentYear || (solutionYearNum === currentYear && solutionDayNum > currentDay);
        }
      } else {
        // If file doesn't exist, use loop variables to check
        const solutionYearNum = parseInt(year);
        const solutionDayNum = parseInt(day);
        isFuture = solutionYearNum > currentYear || (solutionYearNum === currentYear && solutionDayNum > currentDay);
      }

      // If in the future, show "Not yet available"
      if (isFuture) {
        yearLines.push(`  Day ${paddedDay}`);
        for (const part of parts) {
          const notAvailableText =
            chalk.hex(macchiato.text)(`Part ${part}: `) + chalk.hex(macchiato.mauve).bold('⏳...');
          yearLines.push(`    ${notAvailableText}`);
        }
        yearLines.push('');
        continue;
      }

      if (!solutionExists) {
        yearLines.push(`  Day ${paddedDay}`);
        for (const part of parts) {
          const skippedText =
            chalk.hex(macchiato.text)(`Part ${part}: `) + chalk.hex(macchiato.mauve).bold('Solution file missing');
          yearLines.push(`    ${skippedText}`);
        }
        yearLines.push('');
        continue;
      }

      if (!solution) {
        yearLines.push(`  Day ${paddedDay}`);
        yearLines.push(`    ✗ Solution module does not export a default object`);
        yearLines.push('');
        continue;
      }

      // Check if input file exists
      const inputFile = Bun.file(inputPath);
      const inputExists = await inputFile.exists();
      if (!inputExists) {
        yearLines.push(`  Day ${paddedDay}`);
        for (const part of parts) {
          const skippedText =
            chalk.hex(macchiato.text)(`Part ${part}: `) + chalk.hex(macchiato.mauve).bold('Input file missing');
          yearLines.push(`    ${skippedText}`);
        }
        yearLines.push('');
        continue;
      }

      // Read input file
      const input = await inputFile.text();

      // Run specified parts
      for (const part of parts) {
        const partKey = `part${part}` as keyof typeof solution;
        const partFunction = solution[partKey];

        if (!partFunction || typeof partFunction !== 'function') {
          yearLines.push(`    ✗ Part ${part} not found or is not a function`);
          continue;
        }

        try {
          const result = await partFunction(input);
          const isImplemented = String(result) !== 'Not implemented';
          const resultColor = isImplemented ? macchiato.green : macchiato.yellow;
          const resultText = chalk.hex(macchiato.text)(`Part ${part}: `) + chalk.hex(resultColor).bold(String(result));
          yearLines.push(`    ${resultText}`);
        } catch (error) {
          yearLines.push(`    ✗ Error running part ${part}`);
        }
      }

      yearLines.push('');
    }

    // Remove trailing empty line if present
    if (yearLines[yearLines.length - 1] === '') {
      yearLines.pop();
    }

    // Display year box
    const yearContent = yearLines.join('\n');
    const yearBox = boxen(yearContent, {
      padding: { top: 1, bottom: 1, left: 1, right: 1 },
      borderColor: macchiato.blue,
      borderStyle: 'round',
    });
    console.log(yearBox);
  }
};

const runSolutions = defineCommand({
  meta: {
    name: 'run-solutions',
    description: 'Run Advent of Code solutions',
  },
  args: {
    year: {
      type: 'string',
      description: 'The year for which to run solution(s) (optional, defaults to all years)',
      required: false,
    },
    day: {
      type: 'string',
      description: 'The day for which to run solutions (optional, defaults to all days 1-12)',
      required: false,
    },
    parts: {
      type: 'string',
      description: 'Comma-separated list of parts to run (e.g., "1,2"). Requires --day to be specified.',
      required: false,
    },
  },
  run,
});

runMain(runSolutions);
