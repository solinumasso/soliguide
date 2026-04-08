import { Module } from '@nestjs/common';
import * as path from 'node:path';
import { SearchService } from './search/search.service';
import { PLACE_SEARCH_READER } from './search/ports/place-search-reader.port';
import { SearchResultMapper } from './search/adapters/mongo/result-mapper/search-result.mapper';
import { MongoPlaceSearchReaderAdapter } from './search/adapters/mongo/mongo-place-search-reader.adapter';
import { PlaceSearchQueryBuilder } from './search/adapters/mongo/query-builder/place-search.query-builder';
import { DslCompiler } from '../api-versioning/versioning/dsl/dsl-compiler';
import { SearchController } from './api/search.controller';
import { ApiVersioningInterceptor } from './api/api-versioning.interceptor';
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
  ValidationSchemaCache,
  VersionRegistry,
  VersionResolver,
  VersioningDefinition,
} from '../api-versioning/versioning';

import { PlacesDatabaseService } from './search/adapters/mongo/places-database.service';
import {
  searchVersionChangeProviders,
  searchVersionProviders,
  SearchVersionProvider,
  buildSearchVersioningDefinition,
  buildSearchVersions,
  searchOpenApiOperationTarget,
} from './api/schema';

type GeneratedContractsModule = {
  requestSchemasByVersion: ValidationSchemaCache;
  responseSchemasByVersion: ValidationSchemaCache;
};

function readGeneratedContractsOverride():
  | GeneratedContractsModule
  | undefined {
  return (
    globalThis as {
      __PUBLIC_API_GENERATED_CONTRACTS__?: GeneratedContractsModule;
    }
  ).__PUBLIC_API_GENERATED_CONTRACTS__;
}

function loadGeneratedContractsModule(): {
  requestSchemasByVersion: ValidationSchemaCache;
  responseSchemasByVersion: ValidationSchemaCache;
} {
  const emptyCache: ValidationSchemaCache = new Map();
  const override = readGeneratedContractsOverride();
  if (override) {
    return override;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const contractsModule = require('./api/schema/contracts.generated.ts') as {
      requestSchemasByVersion?: ValidationSchemaCache;
      responseSchemasByVersion?: ValidationSchemaCache;
    };

    return {
      requestSchemasByVersion:
        contractsModule.requestSchemasByVersion ?? emptyCache,
      responseSchemasByVersion:
        contractsModule.responseSchemasByVersion ?? emptyCache,
    };
  } catch (error) {
    if (process.env.PUBLIC_API_GENERATE_ARTIFACTS === '1') {
      return {
        requestSchemasByVersion: emptyCache,
        responseSchemasByVersion: emptyCache,
      };
    }

    throw error;
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
    ApiVersioningInterceptor,
    SearchResultMapper,
    PlacesDatabaseService,
    PlaceSearchQueryBuilder,
    MongoPlaceSearchReaderAdapter,
    {
      provide: PLACE_SEARCH_READER,
      useExisting: MongoPlaceSearchReaderAdapter,
    },
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
      useValue: path.resolve(process.cwd(), 'src/app/api/schema'),
    },
    {
      provide: FIRST_VERSION_SCHEMA_SEED_CONFIG,
      useValue: {
        request: {
          importPath: './2026-01-01.search.request',
          exportName: 'v20260101SearchRequestSchema',
        },
        response: {
          importPath: './2026-01-01.search.response',
          exportName: 'v20260101SearchResponseSchema',
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
