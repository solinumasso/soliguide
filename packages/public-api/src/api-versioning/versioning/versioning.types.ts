import { z } from 'zod';
import { Change } from './changes';
import { MaybeAsync } from '../utils';

export type ApiVersion = `${number}-${number}-${number}`;

export interface FieldSpec {
  zod: z.ZodTypeAny;
}

export type ObjectPath = string;

type PathDepth = 0 | 1 | 2 | 3 | 4 | 5 | 6;

type DecPathDepth = {
  0: 0;
  1: 0;
  2: 1;
  3: 2;
  4: 3;
  5: 4;
  6: 5;
};

type PathKeyOf<T> = Extract<keyof T, string>;

type IsPathDerivableObject<T> = T extends object
  ? T extends (...args: readonly unknown[]) => unknown
    ? false
    : string extends keyof T
      ? false
      : number extends keyof T
        ? false
        : true
  : false;

type IsPathDerivable<T> = T extends readonly unknown[]
  ? true
  : IsPathDerivableObject<T>;

type BuildTypedObjectPath<
  TValue,
  AllowWildcard extends boolean,
  Depth extends PathDepth,
  Prefix extends string,
> = Depth extends 0
  ? never
  : TValue extends readonly (infer Item)[]
    ? AllowWildcard extends true
      ?
          | `${Prefix}/*`
          | BuildTypedObjectPath<
              Item,
              AllowWildcard,
              DecPathDepth[Depth],
              `${Prefix}/*`
            >
      : never
    : IsPathDerivableObject<TValue> extends true
      ? {
          [TKey in PathKeyOf<TValue>]:
            | `${Prefix}/${TKey}`
            | BuildTypedObjectPath<
                TValue[TKey],
                AllowWildcard,
                DecPathDepth[Depth],
                `${Prefix}/${TKey}`
              >;
        }[PathKeyOf<TValue>]
      : never;

export type TypedObjectPath<
  TValue,
  AllowWildcard extends boolean,
  Depth extends PathDepth = 6,
> =
  IsPathDerivable<TValue> extends true
    ? '/' | BuildTypedObjectPath<TValue, AllowWildcard, Depth, ''>
    : ObjectPath;

export type PayloadObjectPath<TPayload> = TypedObjectPath<TPayload, true>;

type CollectFieldKeys<TValue, Depth extends PathDepth = 6> = Depth extends 0
  ? never
  : TValue extends readonly (infer Item)[]
    ? CollectFieldKeys<Item, DecPathDepth[Depth]>
    : IsPathDerivableObject<TValue> extends true
      ?
          | PathKeyOf<TValue>
          | {
              [TKey in PathKeyOf<TValue>]: CollectFieldKeys<
                TValue[TKey],
                DecPathDepth[Depth]
              >;
            }[PathKeyOf<TValue>]
      : never;

export type PayloadFieldKey<TPayload> = [CollectFieldKeys<TPayload>] extends [
  never,
]
  ? string
  : CollectFieldKeys<TPayload>;

export interface OpenApiOperationTarget {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
}

export interface VersioningDefinition {
  resource: string;
  versions: readonly Version[];
  baseRequestSchema: z.ZodTypeAny;
  baseResponseSchema: z.ZodTypeAny;
}

export interface CompiledSchemaPatch {
  payloadPath: ObjectPath;
  replace?: FieldSpec;
  set?: Readonly<Record<string, FieldSpec>>;
  remove?: readonly string[];
}

export interface CompiledRequestChange {
  changeClassName?: string;
  description: string;
  sourceFilePath?: string;
  schemaPatch: CompiledSchemaPatch;
  upgrade(payload: unknown): MaybeAsync<unknown>;
}

export type ResponseDowngradeContext = Record<string, unknown>;

export interface CompiledResponseChange {
  changeClassName?: string;
  description: string;
  sourceFilePath?: string;
  schemaPatch: CompiledSchemaPatch;
  downgrade(
    payload: unknown,
    context?: ResponseDowngradeContext,
  ): MaybeAsync<unknown>;
}

export type RequestVersionChange = CompiledRequestChange;

export type ResponseVersionChange = CompiledResponseChange;

export interface Version {
  version: ApiVersion;
  description: string;
  requestChanges: readonly Change[];
  responseChanges: readonly Change[];
  prepareResponseDowngradeContext?(
    payload: unknown,
    context: ResponseDowngradeContext,
  ): MaybeAsync<void>;
}

export interface CompiledVersion {
  version: ApiVersion;
  description: string;
  requestChanges: readonly CompiledRequestChange[];
  responseChanges: readonly CompiledResponseChange[];
  prepareResponseDowngradeContext?(
    payload: unknown,
    context: ResponseDowngradeContext,
  ): MaybeAsync<void>;
}

export type ValidationSchemaCache = ReadonlyMap<ApiVersion, z.ZodTypeAny>;

export interface ResolvedVersion {
  normalizedVersion: ApiVersion;
  isMissing: boolean;
}
