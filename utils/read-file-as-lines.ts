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
