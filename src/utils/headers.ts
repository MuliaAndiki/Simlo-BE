export const getHeader = (header: string | string[] | undefined): string => {
  if (Array.isArray(header)) return header[0];
  return header ?? "unknown";
};
