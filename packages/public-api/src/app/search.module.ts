import { Module } from '@nestjs/common';
import * as path from 'node:path';
import { SearchService } from './search.service';
import { DslCompiler } from '../api-versioning/versioning/dsl-compiler';
import { SearchController } from './search.controller';
import {
  REQUEST_SCHEMAS_BY_VERSION,
  RESPONSE_SCHEMAS_BY_VERSION,
  VERSIONING_DEFINITION,
} from '../api-versioning/runtime/versioning.tokens';
import {
  ArtifactGenerationService,
  ARTIFACTS_OUTPUT_DIRECTORY,
  FIRST_VERSION_SCHEMA_SEED_CONFIG,
  OPENAPI_DECORATED_MODULE,
  OPENAPI_OPERATION_TARGET,
} from '../api-versioning/artifacts';
import { RequestVersioningPipeline } from '../api-versioning/runtime/request-versioning.pipeline';
import { ResponseVersioningPipeline } from '../api-versioning/runtime/response-versioning.pipeline';
import { VersioningEngine } from '../api-versioning/runtime';
import {
  type ApiVersion,
  ValidationSchemaCache,
  VersionRegistry,
  VersionResolver,
  VersioningDefinition,
} from '../api-versioning/versioning';
import {
  searchVersionChangeProviders,
  searchVersionProviders,
  SearchVersionProvider,
  buildSearchVersioningDefinition,
  buildSearchVersions,
  searchOpenApiOperationTarget,
} from './schema';

function loadGeneratedContractsModule(): {
  requestSchemasByVersion: ValidationSchemaCache;
  responseSchemasByVersion: ValidationSchemaCache;
} {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('./generated/contracts') as {
      requestSchemasByVersion: ValidationSchemaCache;
      responseSchemasByVersion: ValidationSchemaCache;
    };
  } catch (error) {
    if (process.env.PUBLIC_API_GENERATE_ARTIFACTS === '1') {
      return {
        requestSchemasByVersion: new Map<ApiVersion, never>(),
        responseSchemasByVersion: new Map<ApiVersion, never>(),
      };
    }

    throw new Error(
      `Unable to load generated contracts module at src/app/generated/contracts. Regenerate search-api artifacts. Root cause: ${(error as Error).message}`,
    );
  }
}

function assertSchemaCoverage(
  schemaKind: 'request' | 'response',
  schemasByVersion: ValidationSchemaCache,
  registry: VersionRegistry,
): ValidationSchemaCache {
  if (process.env.PUBLIC_API_GENERATE_ARTIFACTS === '1') {
    return schemasByVersion;
  }

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

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    VersionResolver,
    DslCompiler,
    ...searchVersionChangeProviders,
    ...searchVersionProviders,
    {
      provide: VERSIONING_DEFINITION,
      useFactory: (...versionProviders: SearchVersionProvider[]) => {
        return buildSearchVersioningDefinition(
          buildSearchVersions(versionProviders),
        );
      },
      inject: [...searchVersionProviders],
    },
    {
      provide: OPENAPI_OPERATION_TARGET,
      useValue: searchOpenApiOperationTarget,
    },
    {
      provide: OPENAPI_DECORATED_MODULE,
      useValue: SearchModule,
    },
    {
      provide: ARTIFACTS_OUTPUT_DIRECTORY,
      useValue: path.resolve(process.cwd(), 'src/app/generated'),
    },
    {
      provide: FIRST_VERSION_SCHEMA_SEED_CONFIG,
      useValue: {
        request: {
          importPath: '../../schema/search.request/search.request',
          exportName: 'searchRequestSchema',
        },
        response: {
          importPath: '../../schema/search.response/search.response',
          exportName: 'searchResponseSchema',
        },
      },
    },
    {
      provide: VersionRegistry,
      useFactory: (definition: VersioningDefinition, compiler: DslCompiler) => {
        return new VersionRegistry(definition, compiler);
      },
      inject: [VERSIONING_DEFINITION, DslCompiler],
    },
    {
      provide: REQUEST_SCHEMAS_BY_VERSION,
      useFactory: (registry: VersionRegistry) => {
        const { requestSchemasByVersion } = loadGeneratedContractsModule();
        return assertSchemaCoverage(
          'request',
          new Map(requestSchemasByVersion),
          registry,
        );
      },
      inject: [VersionRegistry],
    },
    {
      provide: RESPONSE_SCHEMAS_BY_VERSION,
      useFactory: (registry: VersionRegistry) => {
        const { responseSchemasByVersion } = loadGeneratedContractsModule();
        return assertSchemaCoverage(
          'response',
          new Map(responseSchemasByVersion),
          registry,
        );
      },
      inject: [VersionRegistry],
    },
    RequestVersioningPipeline,
    ResponseVersioningPipeline,
    VersioningEngine,
    ArtifactGenerationService,
  ],
  exports: [
    VersioningEngine,
    ArtifactGenerationService,
    VersionResolver,
    VersionRegistry,
    RequestVersioningPipeline,
    ResponseVersioningPipeline,
    REQUEST_SCHEMAS_BY_VERSION,
    RESPONSE_SCHEMAS_BY_VERSION,
  ],
})
export class SearchModule {}
