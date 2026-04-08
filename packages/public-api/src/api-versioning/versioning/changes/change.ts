import type { RequestOperation, ResponseOperation } from '../dsl/operations';

const DEFAULT_PATH = '/';

export abstract class Change {
  sourceFilePath: string | undefined = resolveChangeSourceFilePath();

  abstract description: string;

  abstract toRequestOperation(): RequestOperation;

  abstract toResponseOperation(): ResponseOperation;

  protected payloadPathValue(): string {
    const payloadPath = (this as { payloadPath?: string }).payloadPath;
    return payloadPath ?? DEFAULT_PATH;
  }
}

function resolveChangeSourceFilePath(): string | undefined {
  const stack = new Error().stack;
  if (!stack) {
    return undefined;
  }

  const lines = stack.split('\n').slice(1);
  for (const line of lines) {
    const frame = line.trim();
    const withParentheses = frame.match(/\((.+):\d+:\d+\)$/);
    const bare = frame.match(/at (.+):\d+:\d+$/);
    const candidate = withParentheses?.[1] ?? bare?.[1];
    if (!candidate) {
      continue;
    }

    if (
      candidate.includes('/api-versioning/versioning/changes/change.') ||
      candidate.startsWith('node:') ||
      candidate.includes('internal/')
    ) {
      continue;
    }

    return candidate;
  }

  return undefined;
}
