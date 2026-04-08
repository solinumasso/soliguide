import { Module } from '@nestjs/common';
import * as path from 'node:path';
import { SearchService } from './search/search.service';
import { PLACE_SEARCH_READER } from './search/ports/place-search-reader.port';
import { SearchResultMapper } from './search/adapters/mongo/result-mapper/search-result.mapper';
import { MongoPlaceSearchReaderAdapter } from './search/adapters/mongo/mongo-place-search-reader.adapter';
import { PlaceSearchQueryBuilder } from './search/adapters/mongo/query-builder/place-search.query-builder';
import { SearchController } from './api/search.controller';
import { ApiVersioningInterceptor } from './api/api-versioning.interceptor';
import { ApiVersioningModule } from '../api-versioning';
import type {
  ApiVersioningContracts,
  ValidationSchemaCache,
} from '../api-versioning';
import {
  buildSearchVersioningDefinition,
  buildSearchVersions,
  searchOpenApiOperationTarget,
  type SearchVersionProvider,
  searchVersionProviders,
  searchVersionChangeProviders,
} from './api/schema';

import { PlacesDatabaseService } from './search/adapters/mongo/places-database.service';

type GeneratedContractsModule = ApiVersioningContracts;

function readGeneratedContractsOverride():
  | GeneratedContractsModule
  | undefined {
  return (
    globalThis as {
      __PUBLIC_API_GENERATED_CONTRACTS__?: GeneratedContractsModule;
    }
  ).__PUBLIC_API_GENERATED_CONTRACTS__;
}

function buildVersioningDefinition(
  ...providers: readonly SearchVersionProvider[]
) {
  return buildSearchVersioningDefinition(buildSearchVersions(providers));
}

function loadGeneratedContractsModule(): GeneratedContractsModule {
  const emptyCache: ValidationSchemaCache = new Map();
  const override = readGeneratedContractsOverride();
  if (override) {
    return override;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const contractsModule = require('./api/schema/contracts.generated') as {
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

@Module({
  imports: [
    ApiVersioningModule.forRoot({
      providers: [
        PlacesDatabaseService,
        ...searchVersionProviders,
        ...searchVersionChangeProviders,
      ],
      versioningDefinitionFactory: buildVersioningDefinition,
      versioningDefinitionInject: [...searchVersionProviders],
      contractsByVersionFactory: loadGeneratedContractsModule,
      openApiOperationTarget: searchOpenApiOperationTarget,
      openApiDecoratedModule: SearchModule,
      artifactsOutputDirectory: path.resolve(
        process.cwd(),
        'src/app/api/schema',
      ),
      firstVersionSchemaSeedConfig: {
        request: {
          importPath: './2026-01-01.search.request',
          exportName: 'v20260101SearchRequestSchema',
        },
        response: {
          importPath: './2026-01-01.search.response',
          exportName: 'v20260101SearchResponseSchema',
        },
      },
      allowMissingSchemas: process.env.PUBLIC_API_GENERATE_ARTIFACTS === '1',
    }),
  ],
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
  ],
  exports: [ApiVersioningModule],
})
export class SearchModule {}
