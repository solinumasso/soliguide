export { DslCompiler } from './dsl-compiler';
export { VersionRegistry } from './version-registry';
export { VersionResolver, normalizeVersion } from './version-resolver';
export {
  defineVersion,
  materializeRequestChanges,
  materializeResponseChanges,
  RenameFieldRequestChange,
  RenameFieldResponseChange,
  ReplaceFieldResponseChange,
  RequestChange,
  ResponseChange,
} from './changes';
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
  OpenApiObjectPath,
  OpenApiOperationTarget,
  OpenApiPropertyDescriptor,
  OpenApiPropertySchema,
  PayloadFieldKey,
  PayloadObjectPath,
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
  VersioningDefinition,
} from './versioning.types';
export type {
  RequestChangeDefinition,
  ResponseChangeDefinition,
  VersionDefinitionInput,
} from './changes';
