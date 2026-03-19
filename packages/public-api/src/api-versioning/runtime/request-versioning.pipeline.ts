import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { z } from 'zod';
import { VersionResolver } from '../versioning/version-resolver';
import { VersionRegistry } from '../versioning/version-registry';
import { REQUEST_SCHEMAS_BY_VERSION } from './versioning.tokens';
import type {
  ApiVersion,
  ValidationSchemaCache,
} from '../versioning/versioning.types';

@Injectable()
export class RequestVersioningPipeline {
  constructor(
    private readonly registry: VersionRegistry,
    private readonly versionResolver: VersionResolver,
    @Inject(REQUEST_SCHEMAS_BY_VERSION)
    private readonly requestSchemasByVersion: ValidationSchemaCache,
  ) {}

  async upgradeRequest(
    payload: unknown,
    requestedVersion: string | null | undefined,
  ): Promise<unknown> {
    const { normalizedVersion } = this.versionResolver.resolveVersion(
      requestedVersion,
      this.registry.supportedVersions,
      this.registry.canonicalVersion,
    );

    const sourceSchema = this.getRequestSchema(normalizedVersion);
    const parsed = sourceSchema.safeParse(payload);

    if (!parsed.success) {
      throw new BadRequestException({
        message: `Request payload is invalid for API version ${normalizedVersion}.`,
        issues: z.treeifyError(parsed.error),
      });
    }

    if (normalizedVersion === this.registry.canonicalVersion) {
      return parsed.data;
    }

    const sourceIndex = this.registry.getVersionIndex(normalizedVersion);
    const canonicalIndex = this.registry.getVersionIndex(
      this.registry.canonicalVersion,
    );

    let transformedPayload = parsed.data;

    for (
      let versionIndex = sourceIndex + 1;
      versionIndex <= canonicalIndex;
      versionIndex += 1
    ) {
      const version = this.registry.getCompiledVersionByIndex(versionIndex);

      for (const change of version.requestChanges) {
        try {
          transformedPayload = await change.upgrade(transformedPayload);
        } catch (error) {
          throw new InternalServerErrorException(
            `Failed to apply request upgrade change "${change.description}" for version ${version.version}.`,
            {
              cause: error,
            },
          );
        }
      }
    }

    const canonicalSchema = this.getRequestSchema(this.registry.canonicalVersion);
    const canonicalParsed = canonicalSchema.safeParse(transformedPayload);

    if (!canonicalParsed.success) {
      throw new InternalServerErrorException(
        `Transformed request payload is invalid for canonical API version ${this.registry.canonicalVersion}.`,
        {
          cause: canonicalParsed.error,
        },
      );
    }

    return canonicalParsed.data;
  }

  private getRequestSchema(version: ApiVersion): z.ZodTypeAny {
    const schema = this.requestSchemasByVersion.get(version);

    if (!schema) {
      throw new InternalServerErrorException(
        `Missing request schema for API version ${version}.`,
      );
    }

    return schema;
  }
}
