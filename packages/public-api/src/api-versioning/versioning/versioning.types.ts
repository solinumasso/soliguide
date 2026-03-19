/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { z } from 'zod';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import type {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type ApiVersion = `${number}-${number}-${number}`;

export type OpenApiPropertySchema =
  | (SchemaObject & Partial<Record<`x-${string}`, unknown>>)
  | (ReferenceObject & Partial<Record<`x-${string}`, unknown>>);

export interface OpenApiPropertyDescriptor {
  schema: OpenApiPropertySchema;
  required?: boolean;
}

export interface ApiPropertyDescriptorOptions {
  required?: boolean;
}

export type DecoratorFreeApiPropertyOptions = ApiPropertyOptions &
  ApiPropertyDescriptorOptions;

export interface FieldSpec {
  zod: z.ZodTypeAny;
  openApi: OpenApiPropertyDescriptor;
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
export type OpenApiObjectPath<TOpenApiSchema> = TypedObjectPath<
  TOpenApiSchema,
  false
>;

type CollectFieldKeys<
  TValue,
  Depth extends PathDepth = 6,
> = Depth extends 0
  ? never
  : TValue extends readonly (infer Item)[]
    ? CollectFieldKeys<Item, DecPathDepth[Depth]>
    : IsPathDerivableObject<TValue> extends true
      ? | PathKeyOf<TValue>
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

interface VersionOperationBase<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
> {
  payloadPath?: TPayloadPath;
  openApiPath?: TOpenApiPath;
}

export interface AddFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'addField';
  field: TField;
  spec: FieldSpec;
  buildValue?: (
    container: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
}

export interface RemoveFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'removeField';
  field: TField;
  restoreValue?: (
    container: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
}

export interface RenameFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'renameField';
  from: TFrom;
  to: string;
  toSpec: FieldSpec;
  mapValue?: ValueMapper;
  downgradeValue?: ValueMapper;
}

export interface CopyFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'copyField';
  from: TFrom;
  to: string;
  toSpec: FieldSpec;
  mapValue?: ValueMapper;
  downgradeValue?: ValueMapper;
}

export interface MoveFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'moveField';
  from: TFrom;
  to: string;
  toSpec: FieldSpec;
  mapValue?: ValueMapper;
  downgradeValue?: ValueMapper;
}

export interface ReplaceFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'replaceField';
  field: TField;
  spec: FieldSpec;
  mapValue: ValueMapper;
  downgradeValue?: ValueMapper;
}

export interface SplitFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'splitField';
  from: TFrom;
  into: Readonly<Record<string, FieldSpec>>;
  split: SplitMapper;
  merge?: MergeMapper;
  removeSource?: boolean;
}

export interface MergeFieldsOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'mergeFields';
  from: readonly TFrom[];
  to: string;
  toSpec: FieldSpec;
  merge: MergeMapper;
  split?: SplitMapper;
  removeSources?: boolean;
}

export interface CustomTransformOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends VersionOperationBase<TPayloadPath, TOpenApiPath> {
  kind: 'customTransform';
  schemaPatch?: {
    set?: Readonly<Record<string, FieldSpec>>;
    remove?: readonly TField[];
  };
}

export interface RequestCustomTransformOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends CustomTransformOperation<TPayloadPath, TOpenApiPath, TField> {
  upgrade: ContainerMapper;
}

export interface ResponseCustomTransformOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TOpenApiPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> extends CustomTransformOperation<TPayloadPath, TOpenApiPath, TField> {
  downgrade: ContainerMapper;
}

export type RequestOperation<TPayload = unknown, TOpenApiSchema = unknown> =
  | AddFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | RemoveFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | RenameFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | CopyFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | MoveFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | ReplaceFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | SplitFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | MergeFieldsOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | RequestCustomTransformOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >;

export type ResponseOperation<TPayload = unknown, TOpenApiSchema = unknown> =
  | AddFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | RemoveFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | RenameFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | CopyFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | MoveFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | ReplaceFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | SplitFieldOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | MergeFieldsOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >
  | ResponseCustomTransformOperation<
      PayloadObjectPath<TPayload>,
      OpenApiObjectPath<TOpenApiSchema>,
      PayloadFieldKey<TPayload>
    >;

export interface RequestVersionChange<
  TPayload = unknown,
  TOpenApiSchema = unknown,
> {
  description: string;
  operation: RequestOperation<TPayload, TOpenApiSchema>;
}

export interface ResponseVersionChange<
  TPayload = unknown,
  TOpenApiSchema = unknown,
> {
  description: string;
  operation: ResponseOperation<TPayload, TOpenApiSchema>;
}

export interface Version<
  TRequestPayload = unknown,
  TResponsePayload = unknown,
  TRequestOpenApiSchema = unknown,
  TResponseOpenApiSchema = unknown,
> {
  version: ApiVersion;
  description: string;
  requestChanges: readonly RequestVersionChange<
    TRequestPayload,
    TRequestOpenApiSchema
  >[];
  responseChanges: readonly ResponseVersionChange<
    TResponsePayload,
    TResponseOpenApiSchema
  >[];
}

export interface OpenApiOperationTarget {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
}

export interface VersioningDefinition {
  resource: string;
  versions: readonly Version[];
  baseRequestSchema: z.ZodTypeAny;
  baseResponseSchema: z.ZodTypeAny;
  baseRequestOpenApiSchema: OpenApiPropertySchema;
  baseResponseOpenApiSchema: OpenApiPropertySchema;
}

export interface CompiledSchemaPatch {
  payloadPath: ObjectPath;
  set?: Readonly<Record<string, FieldSpec>>;
  remove?: readonly string[];
}

export interface CompiledOpenApiPatch {
  objectPath: ObjectPath;
  set?: Readonly<Record<string, OpenApiPropertyDescriptor>>;
  remove?: readonly string[];
}

export interface CompiledRequestChange {
  description: string;
  schemaPatch: CompiledSchemaPatch;
  openApiPatch: CompiledOpenApiPatch;
  upgrade(payload: unknown): Promise<unknown> | unknown;
}

export interface CompiledResponseChange {
  description: string;
  schemaPatch: CompiledSchemaPatch;
  openApiPatch: CompiledOpenApiPatch;
  downgrade(payload: unknown): Promise<unknown> | unknown;
}

export interface CompiledVersion {
  version: ApiVersion;
  description: string;
  requestChanges: readonly CompiledRequestChange[];
  responseChanges: readonly CompiledResponseChange[];
}

export type ValidationSchemaCache = ReadonlyMap<ApiVersion, z.ZodTypeAny>;
export type RequestOpenApiSchemaCache = ReadonlyMap<
  ApiVersion,
  OpenApiPropertySchema
>;
export type ResponseOpenApiSchemaCache = ReadonlyMap<
  ApiVersion,
  OpenApiPropertySchema
>;

export interface ResolvedVersion {
  normalizedVersion: ApiVersion;
  isMissing: boolean;
}
