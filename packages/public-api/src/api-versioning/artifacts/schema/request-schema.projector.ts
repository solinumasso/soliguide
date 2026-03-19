import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { applySchemaPatch } from './zod-schema.utils';
import { VersionRegistry } from '../../versioning/version-registry';
import type {
  ApiVersion,
  ValidationSchemaCache,
} from '../../versioning/versioning.types';

@Injectable()
export class RequestSchemaProjector {
  constructor(private readonly registry: VersionRegistry) {}

  buildRequestSchemaCache(
    baseRequestSchema: z.ZodTypeAny,
  ): ValidationSchemaCache {
    const cache = new Map<ApiVersion, z.ZodTypeAny>();

    if (this.registry.compiledVersions.length === 0) {
      return cache;
    }

    let currentSchema = baseRequestSchema;

    for (const version of this.registry.compiledVersions) {
      for (const change of version.requestChanges) {
        currentSchema = applySchemaPatch(currentSchema, change.schemaPatch);
      }

      cache.set(version.version, currentSchema);
    }

    return cache;
  }
}
