export const isMissingKeys = (data: object, keysToCheckFor: string[]) => {
  const record = data as Record<string, unknown>;
  for (const key of keysToCheckFor) {
    if (record[key] === undefined) return true;
  }
  return false;
};
