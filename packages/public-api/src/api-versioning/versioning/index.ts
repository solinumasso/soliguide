export { DslCompiler } from './dsl-compiler';
export { VersionRegistry } from './version-registry';
export { VersionResolver, normalizeVersion } from './version-resolver';
export {
  AddFieldChange,
  Change,
  CustomTransformChange,
  MergeFieldsChange,
  RemoveFieldChange,
  RenameFieldChange,
  ReplaceFieldChange,
  SplitFieldChange,
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
  FieldSpec,
  MergeFieldsOperation,
  ObjectPath,
  OpenApiOperationTarget,
  PayloadFieldKey,
  PayloadObjectPath,
  RequestRemoveFieldOperation,
  RenameFieldOperation,
  ReplaceFieldOperation,
  ResponseRemoveFieldOperation,
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
  VersionDefinitionProvider,
} from './changes';
