export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function decodePointerToken(token: string): string {
  return token.replace(/~1/g, '/').replace(/~0/g, '~');
}

export function parseObjectPath(
  objectPath: string,
  options: { allowWildcard?: boolean } = {},
): string[] {
  if (objectPath.length === 0 || objectPath === '/') {
    return [];
  }

  if (!objectPath.startsWith('/')) {
    throw new Error(
      `Invalid objectPath "${objectPath}". JSON pointer must start with '/'.`,
    );
  }

  const tokens = objectPath
    .split('/')
    .slice(1)
    .map((token) => decodePointerToken(token));

  if (!options.allowWildcard && tokens.some((token) => token === '*')) {
    throw new Error(
      `Invalid objectPath "${objectPath}". Wildcard '*' is not allowed for this operation.`,
    );
  }

  return tokens;
}

function cloneDeep<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

async function walkAndTransform(
  cursor: unknown,
  tokens: readonly string[],
  mapper: (container: Record<string, unknown>) => Promise<void>,
): Promise<unknown> {
  if (tokens.length === 0) {
    if (isRecord(cursor)) {
      await mapper(cursor);
    }

    return cursor;
  }

  const [head, ...rest] = tokens;

  if (head === '*') {
    if (!Array.isArray(cursor)) {
      return cursor;
    }

    for (let index = 0; index < cursor.length; index += 1) {
      cursor[index] = await walkAndTransform(cursor[index], rest, mapper);
    }

    return cursor;
  }

  if (!isRecord(cursor) || !(head in cursor)) {
    return cursor;
  }

  cursor[head] = await walkAndTransform(cursor[head], rest, mapper);

  return cursor;
}

export async function transformContainersAtPath(
  payload: unknown,
  objectPath: string,
  mapper: (container: Record<string, unknown>) => Promise<void>,
): Promise<unknown> {
  if (!isRecord(payload) && !Array.isArray(payload)) {
    return payload;
  }

  const nextPayload = cloneDeep(payload);
  const tokens = parseObjectPath(objectPath, { allowWildcard: true });
  return walkAndTransform(nextPayload, tokens, mapper);
}
