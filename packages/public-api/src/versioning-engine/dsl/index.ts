export { SchemaPath, SchemaPathValue } from "./schema-path";
export {
  add,
  AnyVersionChange,
  ChangeImpact,
  ChangeType,
  patch,
  remove,
  rename,
  replaceSchema,
  schema,
} from "./changes/version-change";
export { ResourceKind } from "./changes/runtime";
export {
  defineVersion,
  ResourceChangesFactory,
  resource,
  VersionContextInput,
  VersionContextProvider,
  VersionContextProviderToken,
  VersionDefinition,
  VersionedResourceDefinition,
} from "./version-definition";
