export const stringToLines = (input: string) => {
  return input.split('\n').map((line) => line.trim());
};
