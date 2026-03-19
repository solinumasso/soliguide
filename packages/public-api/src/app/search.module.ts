import { Module } from '@nestjs/common';
import * as path from 'node:path';
import { SearchService } from './search.service';
import {
  requestSchemasByVersion,
  responseSchemasByVersion,
} from './generated/contracts';
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
  OPENAPI_DECORATED_MODULE,
  OPENAPI_OPERATION_TARGET,
} from '../api-versioning/artifacts';
import { RequestOpenApiProjector } from '../api-versioning/artifacts/openapi/request-openapi.projector';
import { RequestSchemaProjector } from '../api-versioning/artifacts/schema/request-schema.projector';
import { RequestVersioningPipeline } from '../api-versioning/runtime/request-versioning.pipeline';
import { ResponseOpenApiProjector } from '../api-versioning/artifacts/openapi/response-openapi.projector';
import { ResponseSchemaProjector } from '../api-versioning/artifacts/schema/response-schema.projector';
import { ResponseVersioningPipeline } from '../api-versioning/runtime/response-versioning.pipeline';
import { VersioningEngine } from '../api-versioning/runtime';
import {
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

@Module({
  controllers: [SearchController],
  providers: [
    SearchService,
    VersionResolver,
    DslCompiler,
    RequestSchemaProjector,
    ResponseSchemaProjector,
    RequestOpenApiProjector,
    ResponseOpenApiProjector,
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
      provide: VersionRegistry,
      useFactory: (definition: VersioningDefinition, compiler: DslCompiler) => {
        return new VersionRegistry(definition, compiler);
      },
      inject: [VERSIONING_DEFINITION, DslCompiler],
    },
    {
      provide: REQUEST_SCHEMAS_BY_VERSION,
      useFactory: (registry: VersionRegistry) => {
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
    RequestOpenApiProjector,
    ResponseOpenApiProjector,
    RequestSchemaProjector,
    ResponseSchemaProjector,
    REQUEST_SCHEMAS_BY_VERSION,
    RESPONSE_SCHEMAS_BY_VERSION,
  ],
})
export class SearchModule {}
