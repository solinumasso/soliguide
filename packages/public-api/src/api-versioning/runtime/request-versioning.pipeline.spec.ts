import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { z } from 'zod';
import { rawProperty } from '../artifacts/openapi/openapi.dsl';
import { DslCompiler } from '../versioning/dsl-compiler';
import { RequestVersioningPipeline } from './request-versioning.pipeline';
import { buildSchemaCaches, catalogVersioningDefinition } from '../testing';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';
import type { VersioningDefinition } from '../versioning/versioning.types';

describe('ProposalC RequestVersioningPipeline', () => {
  let pipeline: RequestVersioningPipeline;

  beforeEach(() => {
    const registry = new VersionRegistry(
      catalogVersioningDefinition,
      new DslCompiler(),
    );
    const resolver = new VersionResolver();
    const { requestSchemasByVersion } = buildSchemaCaches(
      catalogVersioningDefinition,
    );

    pipeline = new RequestVersioningPipeline(
      registry,
      resolver,
      requestSchemasByVersion,
    );
  });

  it('uses canonical schema when version header is missing', async () => {
    await expect(
      pipeline.upgradeRequest({ isOpenToday: 'true', page: '2' }, undefined),
    ).resolves.toEqual({
      isOpenToday: true,
      page: 2,
    });
  });

  it('rejects unsupported versions with 400', async () => {
    await expect(
      pipeline.upgradeRequest({}, '2026-03-10'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects invalid payload for source schema with 400', async () => {
    await expect(
      pipeline.upgradeRequest({ limit: 0 }, '2026-03-03'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('applies upgrade chain from client version', async () => {
    await expect(
      pipeline.upgradeRequest(
        { openToday: 'any-value', page: '3' },
        '2026-03-03',
      ),
    ).resolves.toEqual({
      isOpenToday: true,
      page: 3,
    });
  });

  it('returns 500 when a valid source payload is transformed into an invalid canonical payload', async () => {
    const definition: VersioningDefinition = {
      resource: 'request-canonical-validation',
      baseRequestSchema: z.object({ legacyName: z.string() }).strict(),
      baseResponseSchema: z.object({}).strict(),
      baseRequestOpenApiSchema: {
        type: 'object',
        properties: {
          legacyName: { type: 'string' },
        },
      },
      baseResponseOpenApiSchema: {
        type: 'object',
        properties: {},
      },
      versions: [
        {
          version: '2026-03-03',
          description: 'Legacy',
          requestChanges: [],
          responseChanges: [],
        },
        {
          version: '2026-03-09',
          description: 'Canonical',
          requestChanges: [
            {
              description: 'Rename with invalid mapper output',
              operation: {
                kind: 'renameField',
                from: 'legacyName',
                to: 'canonicalName',
                toSpec: {
                  zod: z.string(),
                  openApi: rawProperty({ type: 'string' }, { required: true }),
                },
                mapValue: () => 123,
              },
            },
          ],
          responseChanges: [],
        },
      ],
    };

    const registry = new VersionRegistry(definition, new DslCompiler());
    const resolver = new VersionResolver();
    const { requestSchemasByVersion } = buildSchemaCaches(definition);
    const invalidTransformPipeline = new RequestVersioningPipeline(
      registry,
      resolver,
      requestSchemasByVersion,
    );

    await expect(
      invalidTransformPipeline.upgradeRequest(
        { legacyName: 'legacy-value' },
        '2026-03-03',
      ),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('returns 500 when generated request schema is missing for a supported version', async () => {
    const registry = new VersionRegistry(
      catalogVersioningDefinition,
      new DslCompiler(),
    );
    const resolver = new VersionResolver();
    const { requestSchemasByVersion } = buildSchemaCaches(
      catalogVersioningDefinition,
    );
    const missingCanonicalSchema = new Map(requestSchemasByVersion);
    missingCanonicalSchema.delete('2026-03-09');

    const pipelineWithMissingSchema = new RequestVersioningPipeline(
      registry,
      resolver,
      missingCanonicalSchema,
    );

    await expect(
      pipelineWithMissingSchema.upgradeRequest(
        { isOpenToday: true },
        '2026-03-09',
      ),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
