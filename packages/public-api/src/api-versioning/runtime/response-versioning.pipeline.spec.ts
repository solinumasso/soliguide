/* eslint-disable @typescript-eslint/require-await */
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { z } from 'zod';
import { DslCompiler } from '../versioning/dsl-compiler';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';
import {
  catalogCanonicalResponse,
  catalogVersioningDefinition,
  expectedLegacyResponse,
} from '../testing';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';
import type { VersioningDefinition } from '../versioning/versioning.types';

describe('ProposalC ResponseVersioningPipeline', () => {
  it('returns payload unchanged when version header is missing', async () => {
    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(catalogVersioningDefinition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(catalogCanonicalResponse, undefined),
    ).resolves.toEqual(catalogCanonicalResponse);
  });

  it('applies downgrade chain from canonical to requested version', async () => {
    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(catalogVersioningDefinition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(catalogCanonicalResponse, '2026-03-03'),
    ).resolves.toEqual(expectedLegacyResponse);
  });

  it('rejects unsupported versions with 400', async () => {
    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(catalogVersioningDefinition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(catalogCanonicalResponse, '2026-03-10'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns 500 when a downgrade transform throws', async () => {
    const definition: VersioningDefinition = {
      ...catalogVersioningDefinition,
      versions: [
        {
          version: '2026-03-03',
          description: 'Initial',
          requestChanges: [],
          responseChanges: [],
        },
        {
          version: '2026-03-09',
          description: 'Breaks on downgrade',
          requestChanges: [],
          responseChanges: [
            {
              description: 'Throws on downgrade',
              operation: {
                kind: 'customTransform',
                payloadPath: '/results/*',
                openApiPath: '/properties/results/items',
                schemaPatch: {
                  set: {
                    seoUrl: {
                      zod: z.string(),
                      openApi: {
                        schema: { type: 'string' },
                        required: true,
                      },
                    },
                  },
                },
                downgrade: async () => {
                  throw new Error('boom');
                },
              },
            },
          ],
        },
      ],
    };

    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(definition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(catalogCanonicalResponse, '2026-03-03'),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
