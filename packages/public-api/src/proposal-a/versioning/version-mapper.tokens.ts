export const normalizeVersion = (version: string): string =>
  version.trim().replace(/^v/i, '');

export const buildResourceVersionToken = (
  resource: string,
  version: string,
): string => `${resource}_${normalizeVersion(version)}`;
