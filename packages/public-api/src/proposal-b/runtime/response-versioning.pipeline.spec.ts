/* eslint-disable @typescript-eslint/require-await */
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { z } from 'zod';
import { DslCompiler } from '../versioning/dsl-compiler';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';
import { searchVersioningDefinition } from '../app/search';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';
import type { VersioningDefinition } from '../versioning/versioning.types';

describe('ProposalC ResponseVersioningPipeline', () => {
  const canonicalResponse = {
    _links: {
      self: { href: '/search?page=1&limit=100' },
      next: { href: '/search?page=1&limit=100' },
      prev: { href: '/search?page=1&limit=100' },
    },
    results: [
      {
        id: '43510',
        seoUrl: 'croix-rouge-francaise-antenne-locale-de-saint-benoit-43510',
        name: {
          originalName:
            'Croix-Rouge francaise - Antenne Locale de Saint Benoit',
          translatedName: 'French Red Cross - Saint Benoit Local Branch',
        },
        description: 'Description',
        type: 'place',
        isOpenToday: true,
        languages: ['fr', 'rcf'],
      },
    ],
    page: {
      current: 1,
      limit: 100,
      totalPages: 1,
      totalResults: 1,
    },
  };

  it('returns payload unchanged when version header is missing', async () => {
    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(searchVersioningDefinition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(canonicalResponse, undefined),
    ).resolves.toEqual(canonicalResponse);
  });

  it('applies downgrade chain from canonical to requested version', async () => {
    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(searchVersioningDefinition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(canonicalResponse, '2026-03-03'),
    ).resolves.toEqual({
      _links: canonicalResponse._links,
      results: [
        {
          id: '43510',
          slug: 'croix-rouge-francaise-antenne-locale-de-saint-benoit-43510',
          name: 'French Red Cross - Saint Benoit Local Branch',
          description: 'Description',
          type: 'place',
          isOpenToday: true,
          languages: ['fr', 'rcf'],
        },
      ],
      page: canonicalResponse.page,
    });
  });

  it('rejects unsupported versions with 400', async () => {
    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(searchVersioningDefinition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(canonicalResponse, '2026-03-10'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns 500 when a downgrade transform throws', async () => {
    const definition: VersioningDefinition = {
      ...searchVersioningDefinition,
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
      pipeline.downgradeResponse(canonicalResponse, '2026-03-03'),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
