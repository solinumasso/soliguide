import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import type { FactoryProvider } from '@nestjs/common';
import {
  ArtifactGenerationService,
  ARTIFACTS_OUTPUT_DIRECTORY,
  FIRST_VERSION_SCHEMA_SEED_CONFIG,
  OPENAPI_DECORATED_MODULE,
  OPENAPI_OPERATION_TARGET,
  type FirstVersionSchemaSeedConfig,
} from './artifacts';
import {
  REQUEST_SCHEMAS_BY_VERSION,
  RESPONSE_SCHEMAS_BY_VERSION,
  VERSIONING_DEFINITION,
  RequestVersioningPipeline,
  ResponseVersioningPipeline,
  VersioningEngine,
} from './runtime';
import {
  DslCompiler,
  VersionRegistry,
  VersionResolver,
  type OpenApiOperationTarget,
  type ValidationSchemaCache,
  type VersioningDefinition,
} from './versioning';

const CONTRACTS_BY_VERSION = Symbol('CONTRACTS_BY_VERSION');

export interface ApiVersioningContracts {
  requestSchemasByVersion: ValidationSchemaCache;
  responseSchemasByVersion: ValidationSchemaCache;
}

export interface ApiVersioningModuleOptions {
  providers?: readonly Provider[];
  versioningDefinition?: VersioningDefinition;
  versioningDefinitionFactory?: (
    ...dependencies: readonly unknown[]
  ) => VersioningDefinition;
  versioningDefinitionInject?: FactoryProvider['inject'];
  contractsByVersion?: ApiVersioningContracts;
  contractsByVersionFactory?: (
    ...dependencies: readonly unknown[]
  ) => ApiVersioningContracts;
  contractsByVersionInject?: FactoryProvider['inject'];
  openApiOperationTarget: OpenApiOperationTarget;
  openApiDecoratedModule: Type<unknown>;
  artifactsOutputDirectory: string;
  firstVersionSchemaSeedConfig?: FirstVersionSchemaSeedConfig;
  allowMissingSchemas?: boolean;
}

function assertSchemaCoverage(
  schemaKind: 'request' | 'response',
  schemasByVersion: ValidationSchemaCache,
  registry: VersionRegistry,
): ValidationSchemaCache {
  const missingVersions = registry.supportedVersions.filter(
    (version) => !schemasByVersion.has(version),
  );

  if (missingVersions.length > 0) {
    throw new Error(
      `Generated ${schemaKind} schemas are missing for API version(s): ${missingVersions.join(', ')}. Regenerate search-api artifacts.`,
    );
  }

  return schemasByVersion;
}

function resolveDefinitionProvider(
  options: ApiVersioningModuleOptions,
): Provider {
  if (options.versioningDefinitionFactory) {
    return {
      provide: VERSIONING_DEFINITION,
      useFactory: options.versioningDefinitionFactory,
      inject: options.versioningDefinitionInject ?? [],
    };
  }

  if (options.versioningDefinition) {
    return {
      provide: VERSIONING_DEFINITION,
      useValue: options.versioningDefinition,
    };
  }

  throw new Error(
    'ApiVersioningModule.forRoot requires either versioningDefinition or versioningDefinitionFactory.',
  );
}

function resolveContractsProvider(
  options: ApiVersioningModuleOptions,
): Provider {
  if (options.contractsByVersionFactory) {
    return {
      provide: CONTRACTS_BY_VERSION,
      useFactory: options.contractsByVersionFactory,
      inject: options.contractsByVersionInject ?? [],
    };
  }

  if (options.contractsByVersion) {
    return {
      provide: CONTRACTS_BY_VERSION,
      useValue: options.contractsByVersion,
    };
  }

  throw new Error(
    'ApiVersioningModule.forRoot requires either contractsByVersion or contractsByVersionFactory.',
  );
}

@Module({})
export class ApiVersioningModule {
  static forRoot(options: ApiVersioningModuleOptions): DynamicModule {
    const definitionProvider = resolveDefinitionProvider(options);
    const contractsProvider = resolveContractsProvider(options);

    const providers: Provider[] = [
      ...(options.providers ?? []),
      DslCompiler,
      VersionResolver,
      definitionProvider,
      {
        provide: OPENAPI_OPERATION_TARGET,
        useValue: options.openApiOperationTarget,
      },
      {
        provide: OPENAPI_DECORATED_MODULE,
        useValue: options.openApiDecoratedModule,
      },
      {
        provide: ARTIFACTS_OUTPUT_DIRECTORY,
        useValue: options.artifactsOutputDirectory,
      },
      {
        provide: FIRST_VERSION_SCHEMA_SEED_CONFIG,
        useValue: options.firstVersionSchemaSeedConfig,
      },
      contractsProvider,
      {
        provide: VersionRegistry,
        useFactory: (definition: VersioningDefinition, compiler: DslCompiler) =>
          new VersionRegistry(definition, compiler),
        inject: [VERSIONING_DEFINITION, DslCompiler],
      },
      {
        provide: REQUEST_SCHEMAS_BY_VERSION,
        useFactory: (
          registry: VersionRegistry,
          contracts: ApiVersioningContracts,
        ) => {
          const schemasByVersion = new Map(contracts.requestSchemasByVersion);

          if (options.allowMissingSchemas) {
            return schemasByVersion;
          }

          return assertSchemaCoverage('request', schemasByVersion, registry);
        },
        inject: [VersionRegistry, CONTRACTS_BY_VERSION],
      },
      {
        provide: RESPONSE_SCHEMAS_BY_VERSION,
        useFactory: (
          registry: VersionRegistry,
          contracts: ApiVersioningContracts,
        ) => {
          const schemasByVersion = new Map(contracts.responseSchemasByVersion);

          if (options.allowMissingSchemas) {
            return schemasByVersion;
          }

          return assertSchemaCoverage('response', schemasByVersion, registry);
        },
        inject: [VersionRegistry, CONTRACTS_BY_VERSION],
      },
      RequestVersioningPipeline,
      ResponseVersioningPipeline,
      VersioningEngine,
      ArtifactGenerationService,
    ];

    return {
      module: ApiVersioningModule,
      providers,
      exports: [
        VersioningEngine,
        ArtifactGenerationService,
        VersionResolver,
        VersionRegistry,
        RequestVersioningPipeline,
        ResponseVersioningPipeline,
        VERSIONING_DEFINITION,
        REQUEST_SCHEMAS_BY_VERSION,
        RESPONSE_SCHEMAS_BY_VERSION,
      ],
    };
  }
}
