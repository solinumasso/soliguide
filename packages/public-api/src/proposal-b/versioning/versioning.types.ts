/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { z } from 'zod';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import type {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type ApiVersion = `${number}-${number}-${number}`;

export interface VersionTransformContext<
  TDeps extends Record<string, unknown> = Record<string, unknown>,
> {
  deps?: TDeps;
  metadata?: Record<string, unknown>;
}

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

export type ValueMapper = (
  value: unknown,
  context: VersionTransformContext,
  container: Record<string, unknown>,
) => Promise<unknown> | unknown;

export type SplitMapper = (
  value: unknown,
  context: VersionTransformContext,
  container: Record<string, unknown>,
) => Promise<Record<string, unknown>> | Record<string, unknown>;

export type MergeMapper = (
  values: Record<string, unknown>,
  context: VersionTransformContext,
  container: Record<string, unknown>,
) => Promise<unknown> | unknown;

export type ContainerMapper = (
  container: Record<string, unknown>,
  context: VersionTransformContext,
) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;

interface VersionOperationBase {
  payloadPath?: ObjectPath;
  openApiPath?: ObjectPath;
}

export interface AddFieldOperation extends VersionOperationBase {
  kind: 'addField';
  field: string;
  spec: FieldSpec;
  buildValue?: (
    context: VersionTransformContext,
    container: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
}

export interface RemoveFieldOperation extends VersionOperationBase {
  kind: 'removeField';
  field: string;
  restoreValue?: (
    context: VersionTransformContext,
    container: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
}

export interface RenameFieldOperation extends VersionOperationBase {
  kind: 'renameField';
  from: string;
  to: string;
  toSpec: FieldSpec;
  mapValue?: ValueMapper;
  downgradeValue?: ValueMapper;
}

export interface CopyFieldOperation extends VersionOperationBase {
  kind: 'copyField';
  from: string;
  to: string;
  toSpec: FieldSpec;
  mapValue?: ValueMapper;
  downgradeValue?: ValueMapper;
}

export interface MoveFieldOperation extends VersionOperationBase {
  kind: 'moveField';
  from: string;
  to: string;
  toSpec: FieldSpec;
  mapValue?: ValueMapper;
  downgradeValue?: ValueMapper;
}

export interface ReplaceFieldOperation extends VersionOperationBase {
  kind: 'replaceField';
  field: string;
  spec: FieldSpec;
  mapValue: ValueMapper;
  downgradeValue?: ValueMapper;
}

export interface SplitFieldOperation extends VersionOperationBase {
  kind: 'splitField';
  from: string;
  into: Readonly<Record<string, FieldSpec>>;
  split: SplitMapper;
  merge?: MergeMapper;
  removeSource?: boolean;
}

export interface MergeFieldsOperation extends VersionOperationBase {
  kind: 'mergeFields';
  from: readonly string[];
  to: string;
  toSpec: FieldSpec;
  merge: MergeMapper;
  split?: SplitMapper;
  removeSources?: boolean;
}

export interface CustomTransformOperation extends VersionOperationBase {
  kind: 'customTransform';
  schemaPatch?: {
    set?: Readonly<Record<string, FieldSpec>>;
    remove?: readonly string[];
  };
}

export interface RequestCustomTransformOperation extends CustomTransformOperation {
  upgrade: ContainerMapper;
}

export interface ResponseCustomTransformOperation extends CustomTransformOperation {
  downgrade: ContainerMapper;
}

export type RequestOperation =
  | AddFieldOperation
  | RemoveFieldOperation
  | RenameFieldOperation
  | CopyFieldOperation
  | MoveFieldOperation
  | ReplaceFieldOperation
  | SplitFieldOperation
  | MergeFieldsOperation
  | RequestCustomTransformOperation;

export type ResponseOperation =
  | AddFieldOperation
  | RemoveFieldOperation
  | RenameFieldOperation
  | CopyFieldOperation
  | MoveFieldOperation
  | ReplaceFieldOperation
  | SplitFieldOperation
  | MergeFieldsOperation
  | ResponseCustomTransformOperation;

export interface RequestVersionChange {
  description: string;
  operation: RequestOperation;
}

export interface ResponseVersionChange {
  description: string;
  operation: ResponseOperation;
}

export interface Version {
  version: ApiVersion;
  description: string;
  requestChanges: readonly RequestVersionChange[];
  responseChanges: readonly ResponseVersionChange[];
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
  upgrade(
    payload: unknown,
    context: VersionTransformContext,
  ): Promise<unknown> | unknown;
}

export interface CompiledResponseChange {
  description: string;
  schemaPatch: CompiledSchemaPatch;
  openApiPatch: CompiledOpenApiPatch;
  downgrade(
    payload: unknown,
    context: VersionTransformContext,
  ): Promise<unknown> | unknown;
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
