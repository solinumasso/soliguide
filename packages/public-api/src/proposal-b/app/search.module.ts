import { Module } from '@nestjs/common';
import { SearchService } from '../../application/search.service';
import {
  requestSchemasByVersion,
  responseSchemasByVersion,
} from '../generated/contracts';
import { DslCompiler } from '../versioning/dsl-compiler';
import { SearchController } from './search.controller';
import {
  OPENAPI_OPERATION_TARGET,
  REQUEST_SCHEMAS_BY_VERSION,
  RESPONSE_SCHEMAS_BY_VERSION,
  VERSIONING_DEFINITION,
} from './search.tokens';
import { RequestOpenApiProjector } from '../projection/openapi/request-openapi.projector';
import { RequestSchemaProjector } from '../projection/schema/request-schema.projector';
import { RequestVersioningPipeline } from '../runtime/request-versioning.pipeline';
import { ResponseOpenApiProjector } from '../projection/openapi/response-openapi.projector';
import { ResponseSchemaProjector } from '../projection/schema/response-schema.projector';
import { ResponseVersioningPipeline } from '../runtime/response-versioning.pipeline';
import {
  searchOpenApiOperationTarget,
  searchVersioningDefinition,
} from './search';
import { VersioningEngine } from '../runtime/versioning.engine';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';
import type {
  ValidationSchemaCache,
  VersioningDefinition,
} from '../versioning/versioning.types';

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
      `Generated ${schemaKind} schemas are missing for API version(s): ${missingVersions.join(', ')}. Regenerate proposal-b artifacts.`,
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
    {
      provide: VERSIONING_DEFINITION,
      useValue: searchVersioningDefinition,
    },
    {
      provide: OPENAPI_OPERATION_TARGET,
      useValue: searchOpenApiOperationTarget,
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
  ],
  exports: [
    VersioningEngine,
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
