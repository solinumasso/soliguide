import { Injectable } from '@nestjs/common';
import { applyOpenApiPatch, cloneOpenApiSchema } from './openapi-schema.utils';
import { VersionRegistry } from '../../versioning/version-registry';
import type {
  ApiVersion,
  OpenApiPropertySchema,
  RequestOpenApiSchemaCache,
} from '../../versioning/versioning.types';

@Injectable()
export class RequestOpenApiProjector {
  constructor(private readonly registry: VersionRegistry) {}

  buildRequestSchemaCache(
    baseRequestOpenApiSchema: OpenApiPropertySchema,
  ): RequestOpenApiSchemaCache {
    const cache = new Map<ApiVersion, OpenApiPropertySchema>();

    if (this.registry.compiledVersions.length === 0) {
      return cache;
    }

    let currentSchema = cloneOpenApiSchema(baseRequestOpenApiSchema);

    for (const version of this.registry.compiledVersions) {
      currentSchema = cloneOpenApiSchema(currentSchema);

      for (const change of version.requestChanges) {
        applyOpenApiPatch(currentSchema, change.openApiPatch);
      }

      cache.set(version.version, cloneOpenApiSchema(currentSchema));
    }

    return cache;
  }
}
