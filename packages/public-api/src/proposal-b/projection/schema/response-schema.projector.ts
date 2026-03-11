import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { applySchemaPatch } from './zod-schema.utils';
import { VersionRegistry } from '../../versioning/version-registry';
import type {
  ApiVersion,
  ValidationSchemaCache,
} from '../../versioning/versioning.types';

@Injectable()
export class ResponseSchemaProjector {
  constructor(private readonly registry: VersionRegistry) {}

  buildResponseSchemaCache(
    baseResponseSchema: z.ZodTypeAny,
  ): ValidationSchemaCache {
    const cache = new Map<ApiVersion, z.ZodTypeAny>();

    if (this.registry.compiledVersions.length === 0) {
      return cache;
    }

    let currentSchema = baseResponseSchema;

    for (const version of this.registry.compiledVersions) {
      for (const change of version.responseChanges) {
        currentSchema = applySchemaPatch(currentSchema, change.schemaPatch);
      }

      cache.set(version.version, currentSchema);
    }

    return cache;
  }
}
