export const toArray = <T>(value?: T | T[], unique = false): T[] => {
  if (value === undefined || value === null) {
    return [];
  }

  const array = Array.isArray(value) ? value : [value];

  return unique ? [...new Set(array)] : array;
};
