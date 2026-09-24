type SearchParams = Record<string, string | string[] | undefined>;

export function getStringParam(
  searchParams: SearchParams,
  key: string,
): string | undefined {
  const value = searchParams[key];
  return typeof value === "string" ? value : undefined;
}
