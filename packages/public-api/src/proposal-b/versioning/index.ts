export { DslCompiler } from './dsl-compiler';
export { VersionRegistry } from './version-registry';
export { VersionResolver, normalizeVersion } from './version-resolver';
export {
  parseObjectPath,
  transformContainersAtPath,
  isRecord,
} from './object-path.utils';
export type {
  AddFieldOperation,
  ApiVersion,
  CompiledRequestChange,
  CompiledResponseChange,
  CompiledVersion,
  CopyFieldOperation,
  FieldSpec,
  MergeFieldsOperation,
  MoveFieldOperation,
  ObjectPath,
  OpenApiOperationTarget,
  OpenApiPropertyDescriptor,
  OpenApiPropertySchema,
  RemoveFieldOperation,
  RenameFieldOperation,
  ReplaceFieldOperation,
  RequestOperation,
  RequestVersionChange,
  ResolvedVersion,
  ResponseOperation,
  ResponseVersionChange,
  SplitFieldOperation,
  ValidationSchemaCache,
  Version,
  VersionTransformContext,
  VersioningDefinition,
} from './versioning.types';
