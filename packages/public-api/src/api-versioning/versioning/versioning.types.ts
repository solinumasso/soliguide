/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { z } from 'zod';
import type {
  RequestChangeDefinition,
  ResponseChangeDefinition,
} from './changes/change';

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

export type ValueMapper = (
  value: unknown,
  container: Record<string, unknown>,
) => Promise<unknown> | unknown;

export type SplitMapper = (
  value: unknown,
  container: Record<string, unknown>,
) => Promise<Record<string, unknown>> | Record<string, unknown>;

export type MergeMapper = (
  values: Record<string, unknown>,
  container: Record<string, unknown>,
) => Promise<unknown> | unknown;

export type ContainerMapper = (
  container: Record<string, unknown>,
) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;

interface VersionOperationBase<TPayloadPath extends ObjectPath = ObjectPath> {
  payloadPath?: TPayloadPath;
}

export interface AddFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath> {
  kind: 'addField';
  field: TField;
  schema: z.ZodTypeAny;
  upgrade?: (
    container: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
}

export interface RequestRemoveFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath> {
  kind: 'removeField';
  field: TField;
}

export interface ResponseRemoveFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath> {
  kind: 'removeField';
  field: TField;
  downgrade: (
    container: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
}

export interface RenameFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> extends VersionOperationBase<TPayloadPath> {
  kind: 'renameField';
  from: TFrom;
  to: string;
  schema: z.ZodTypeAny;
  upgrade?: ValueMapper;
  downgrade?: ValueMapper;
}

export interface ReplaceFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath> {
  kind: 'replaceField';
  field: TField;
  schema: z.ZodTypeAny;
  upgrade: ValueMapper;
  downgrade?: ValueMapper;
}

export interface SplitFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> extends VersionOperationBase<TPayloadPath> {
  kind: 'splitField';
  from: TFrom;
  schemas: Readonly<Record<string, z.ZodTypeAny>>;
  upgrade: SplitMapper;
  downgrade?: MergeMapper;
  removeSource?: boolean;
}

export interface MergeFieldsOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> extends VersionOperationBase<TPayloadPath> {
  kind: 'mergeFields';
  from: readonly TFrom[];
  to: string;
  schema: z.ZodTypeAny;
  upgrade: MergeMapper;
  downgrade?: SplitMapper;
  removeSources?: boolean;
}

export interface CustomTransformOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath> {
  kind: 'customTransform';
  schemaPatch?: {
    set?: Readonly<Record<string, z.ZodTypeAny>>;
    remove?: readonly TField[];
  };
}

export interface RequestCustomTransformOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends CustomTransformOperation<TPayloadPath, TField> {
  upgrade: ContainerMapper;
}

export interface ResponseCustomTransformOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends CustomTransformOperation<TPayloadPath, TField> {
  downgrade: ContainerMapper;
}

export type RequestOperation<TPayload = unknown> =
  | AddFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | RequestRemoveFieldOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >
  | RenameFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | ReplaceFieldOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >
  | SplitFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | MergeFieldsOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | RequestCustomTransformOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >;

export type ResponseOperation<TPayload = unknown> =
  | AddFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | ResponseRemoveFieldOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >
  | RenameFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | ReplaceFieldOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >
  | SplitFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | MergeFieldsOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | ResponseCustomTransformOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >;

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
  set?: Readonly<Record<string, FieldSpec>>;
  remove?: readonly string[];
}

export interface CompiledRequestChange {
  description: string;
  schemaPatch: CompiledSchemaPatch;
  upgrade(payload: unknown): Promise<unknown> | unknown;
}

export interface CompiledResponseChange {
  description: string;
  schemaPatch: CompiledSchemaPatch;
  downgrade(payload: unknown): Promise<unknown> | unknown;
}

export type RequestVersionChange = CompiledRequestChange;

export type ResponseVersionChange = CompiledResponseChange;

export interface Version {
  version: ApiVersion;
  description: string;
  requestChanges: readonly RequestChangeDefinition[];
  responseChanges: readonly ResponseChangeDefinition[];
}

export interface CompiledVersion {
  version: ApiVersion;
  description: string;
  requestChanges: readonly CompiledRequestChange[];
  responseChanges: readonly CompiledResponseChange[];
}

export type ValidationSchemaCache = ReadonlyMap<ApiVersion, z.ZodTypeAny>;

export interface ResolvedVersion {
  normalizedVersion: ApiVersion;
  isMissing: boolean;
}
