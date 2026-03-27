export const OPENAPI_OPERATION_TARGET = Symbol('OPENAPI_OPERATION_TARGET');
export const OPENAPI_DECORATED_MODULE = Symbol('OPENAPI_DECORATED_MODULE');
export const ARTIFACTS_OUTPUT_DIRECTORY = Symbol('ARTIFACTS_OUTPUT_DIRECTORY');
export const FIRST_VERSION_SCHEMA_SEED_CONFIG = Symbol(
  'FIRST_VERSION_SCHEMA_SEED_CONFIG',
);

export interface SchemaSeedImportSource {
  importPath: string;
  exportName: string;
}

export interface FirstVersionSchemaSeedConfig {
  request: SchemaSeedImportSource;
  response: SchemaSeedImportSource;
}
