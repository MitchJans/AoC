import { BunFile } from 'bun';

type Opts<T> = {
  year: number;
  day: number;
  parser: (arg: string) => T;
};

export const readFileAsLines = async <T>({ year, day, parser }: Opts<T>): Promise<T[]> => {
  const file = Bun.file(`${year}/inputs/day${day}.txt`);
  const text = await file.text();
  const entries = text.split('\n');
  return entries.map((entry) => parser(entry));
};

/**
 * Async generator that takes a BunFile and yields each line as a string.
 */
export const asLines = async function* (file: BunFile) {
  const text = await file.text();
  const entries = text.split('\n');
  for (const entry of entries) {
    if (entry.trim() === '') {
      return;
    }
    yield entry;
  }
};
