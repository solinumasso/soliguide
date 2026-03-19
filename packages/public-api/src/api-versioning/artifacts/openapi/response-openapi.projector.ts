import { Injectable } from '@nestjs/common';
import { applyOpenApiPatch, cloneOpenApiSchema } from './openapi-schema.utils';
import { VersionRegistry } from '../../versioning/version-registry';
import type {
  ApiVersion,
  OpenApiPropertySchema,
  ResponseOpenApiSchemaCache,
} from '../../versioning/versioning.types';

@Injectable()
export class ResponseOpenApiProjector {
  constructor(private readonly registry: VersionRegistry) {}

  buildResponseSchemaCache(
    baseResponseOpenApiSchema: OpenApiPropertySchema,
  ): ResponseOpenApiSchemaCache {
    const cache = new Map<ApiVersion, OpenApiPropertySchema>();

    if (this.registry.compiledVersions.length === 0) {
      return cache;
    }

    let currentSchema = cloneOpenApiSchema(baseResponseOpenApiSchema);

    for (const version of this.registry.compiledVersions) {
      currentSchema = cloneOpenApiSchema(currentSchema);

      for (const change of version.responseChanges) {
        applyOpenApiPatch(currentSchema, change.openApiPatch);
      }

      cache.set(version.version, cloneOpenApiSchema(currentSchema));
    }

    return cache;
  }
}
