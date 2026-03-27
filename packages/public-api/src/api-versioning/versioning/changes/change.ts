import type { RequestOperation, ResponseOperation, Version } from '../versioning.types';

export type MaybeAsync<T = unknown> = Promise<T> | T;
export type FieldKey<TContainer> = Extract<keyof TContainer, string>;

export type ResolvedContainer<TPayload> =
  TPayload extends Record<string, unknown> ? TPayload : Record<string, unknown>;

const DEFAULT_PATH = '/';

export abstract class Change {
  abstract description: string;

  abstract toRequestOperation(): RequestOperation;

  abstract toResponseOperation(): ResponseOperation;

  protected payloadPathValue(): string {
    const payloadPath = (this as { payloadPath?: string }).payloadPath;
    return payloadPath ?? DEFAULT_PATH;
  }
}

export type RequestChangeDefinition = Change;
export type ResponseChangeDefinition = Change;

export interface VersionDefinitionProvider {
  toVersion(): Version;
}
