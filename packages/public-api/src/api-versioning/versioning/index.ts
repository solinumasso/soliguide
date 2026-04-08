export { DslCompiler } from './dsl/dsl-compiler';
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
} from './object-path.utils';
export type {
  ApiVersion,
  CompiledRequestChange,
  CompiledResponseChange,
  CompiledVersion,
  FieldSpec,
  ObjectPath,
  OpenApiOperationTarget,
  PayloadFieldKey,
  PayloadObjectPath,
  RequestVersionChange,
  ResolvedVersion,
  ResponseDowngradeContext,
  ResponseVersionChange,
  ValidationSchemaCache,
  Version,
  VersioningDefinition,
} from './versioning.types';
