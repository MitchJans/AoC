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

  // Helper to strip ANSI codes for measuring visual length
  const stripAnsi = (str: string) => str.replace(/\u001b\[[0-9;]*m/g, '');

  // Iterate over years
  for (const year of years) {
    const yearLines: string[] = [year, ''];

    // Collect all day results first for column alignment
    type DayResult = {
      day: string;
      partResults: Array<{ rawText: string; styledText: string }>;
    };
    const dayResults: DayResult[] = [];

    // Iterate over days
    for (const day of days) {
      const paddedDay = day.padStart(2, '0');
      const solutionPath = path.join(process.cwd(), 'years', year, paddedDay, 'index.ts');
      const inputPath = path.join(process.cwd(), 'years', year, paddedDay, 'input.txt');

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
        const partResults = parts.map((part) => ({
          rawText: `Part ${part}: ⏳...`,
          styledText: chalk.hex(macchiato.text)(`Part ${part}: `) + chalk.hex(macchiato.mauve).bold('⏳...'),
        }));
        dayResults.push({ day: paddedDay, partResults });
        continue;
      }

      if (!solutionExists) {
        const partResults = parts.map((part) => ({
          rawText: `Part ${part}: Solution file missing`,
          styledText:
            chalk.hex(macchiato.text)(`Part ${part}: `) + chalk.hex(macchiato.mauve).bold('Solution file missing'),
        }));
        dayResults.push({ day: paddedDay, partResults });
        continue;
      }

      if (!solution) {
        const partResults = [
          {
            rawText: '✗ Solution module does not export a default object',
            styledText: '✗ Solution module does not export a default object',
          },
        ];
        dayResults.push({ day: paddedDay, partResults });
        continue;
      }

      // Check if input file exists
      const inputFile = Bun.file(inputPath);
      const inputExists = await inputFile.exists();
      if (!inputExists) {
        const partResults = parts.map((part) => ({
          rawText: `Part ${part}: Input file missing`,
          styledText:
            chalk.hex(macchiato.text)(`Part ${part}: `) + chalk.hex(macchiato.mauve).bold('Input file missing'),
        }));
        dayResults.push({ day: paddedDay, partResults });
        continue;
      }

      // Read input file
      const input = await inputFile.text();

      // Run specified parts
      const partResults: Array<{ rawText: string; styledText: string }> = [];
      for (const part of parts) {
        const partKey = `part${part}` as keyof typeof solution;
        const partFunction = solution[partKey];

        if (!partFunction || typeof partFunction !== 'function') {
          partResults.push({
            rawText: `✗ Part ${part} not found or is not a function`,
            styledText: `✗ Part ${part} not found or is not a function`,
          });
          continue;
        }

        try {
          const result = await partFunction(input);
          const isImplemented = String(result) !== 'Not implemented';
          const resultColor = isImplemented ? macchiato.green : macchiato.yellow;
          const rawText = `Part ${part}: ${String(result)}`;
          const styledText = chalk.hex(macchiato.text)(`Part ${part}: `) + chalk.hex(resultColor).bold(String(result));
          partResults.push({ rawText, styledText });
        } catch (error) {
          partResults.push({
            rawText: `✗ Error running part ${part}`,
            styledText: `✗ Error running part ${part}`,
          });
        }
      }

      dayResults.push({ day: paddedDay, partResults });
    }

    // Calculate column widths for alignment
    // Find the maximum width of the first part (Part 1) across all days
    const maxPart1Width = dayResults.reduce((max, dayResult) => {
      if (dayResult.partResults.length > 0) {
        const visualLength = stripAnsi(dayResult.partResults[0].rawText).length;
        return visualLength > max ? visualLength : max;
      }
      return max;
    }, 0);

    // Format and add each day's results to yearLines with aligned columns
    for (const dayResult of dayResults) {
      if (dayResult.partResults.length === 0) {
        continue;
      }

      // For single-part results (like error messages), just show them as-is
      if (dayResult.partResults.length === 1) {
        yearLines.push(`  Day ${dayResult.day}  ${dayResult.partResults[0].styledText}`);
        continue;
      }

      // For multi-part results, align Part 2 based on Part 1's max width
      const part1 = dayResult.partResults[0];
      const part1VisualLength = stripAnsi(part1.rawText).length;
      const padding = ' '.repeat(maxPart1Width - part1VisualLength);

      // Build the line with aligned parts
      const partsText =
        part1.styledText +
        padding +
        (dayResult.partResults.length > 1 ? '  ' + dayResult.partResults[1].styledText : '');

      yearLines.push(`  Day ${dayResult.day}  ${partsText}`);
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
