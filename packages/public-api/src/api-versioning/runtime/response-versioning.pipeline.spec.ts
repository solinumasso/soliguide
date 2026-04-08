/* eslint-disable @typescript-eslint/require-await */
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { z } from 'zod';
import { DslCompiler } from '../versioning/dsl/dsl-compiler';
import {
  CustomTransformChange,
  RemoveFieldChange,
} from '../versioning/changes';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';
import {
  catalogCanonicalResponse,
  catalogVersioningDefinition,
  expectedLegacyResponse,
} from '../testing';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';
import type {
  ResponseDowngradeContext,
  VersioningDefinition,
} from '../versioning/versioning.types';
import { describe, expect, it, vi } from 'vitest';

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
          responseChanges: [new ThrowingDowngradeChange()],
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

  it('downgrades type-discriminated results with branch-specific mapping', async () => {
    const definition: VersioningDefinition = {
      resource: 'search',
      baseRequestSchema: z.object({}).strict(),
      baseResponseSchema: z
        .object({
          results: z.array(z.unknown()),
        })
        .strict(),
      versions: [
        {
          version: '2026-03-03',
          description: 'Legacy',
          requestChanges: [],
          responseChanges: [],
        },
        {
          version: '2026-03-09',
          description: 'Type discriminated',
          requestChanges: [],
          responseChanges: [new TypeDiscriminatedPlaceChange()],
        },
      ],
    };

    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(definition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(
        {
          results: [
            {
              type: 'fixedLocation',
              location: { address: 'A' },
              schedule: { status: 'open' },
            },
            {
              type: 'itinerary',
              stops: [
                { location: { address: 'B' }, schedule: { status: 'open' } },
              ],
            },
          ],
        },
        '2026-03-03',
      ),
    ).resolves.toEqual({
      results: [
        {
          placeType: 'LIEU',
          position: { address: 'A' },
          newhours: { status: 'open' },
        },
        {
          placeType: 'PARCOURS_MOBILE',
          parcours: [{ position: { address: 'B' }, hours: { status: 'open' } }],
        },
      ],
    });
  });

  it('returns 500 when a discriminated branch misses required fields', async () => {
    const definition: VersioningDefinition = {
      resource: 'search',
      baseRequestSchema: z.object({}).strict(),
      baseResponseSchema: z
        .object({
          results: z.array(z.unknown()),
        })
        .strict(),
      versions: [
        {
          version: '2026-03-03',
          description: 'Legacy',
          requestChanges: [],
          responseChanges: [],
        },
        {
          version: '2026-03-09',
          description: 'Type discriminated',
          requestChanges: [],
          responseChanges: [new TypeDiscriminatedPlaceChange()],
        },
      ],
    };

    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(definition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(
        {
          results: [
            {
              type: 'fixedLocation',
              location: { address: 'A' },
            },
          ],
        },
        '2026-03-03',
      ),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });

  it('prepares downgrade context once per version before applying response changes', async () => {
    const events: string[] = [];
    const prepareContext = vi.fn(
      async (_payload: unknown, context: ResponseDowngradeContext) => {
        events.push('prepare');
        context.legacyId = 'legacy-123';
      },
    );

    const definition: VersioningDefinition = {
      resource: 'search',
      baseRequestSchema: z.object({}).strict(),
      baseResponseSchema: z
        .object({
          results: z.array(z.unknown()),
        })
        .strict(),
      versions: [
        {
          version: '2026-03-03',
          description: 'Legacy',
          requestChanges: [],
          responseChanges: [],
        },
        {
          version: '2026-03-09',
          description: 'Uses prepared context',
          requestChanges: [],
          responseChanges: [new ContextAwareLegacyIdChange(events)],
          prepareResponseDowngradeContext: prepareContext,
        },
      ],
    };

    const pipeline = new ResponseVersioningPipeline(
      new VersionRegistry(definition, new DslCompiler()),
      new VersionResolver(),
    );

    await expect(
      pipeline.downgradeResponse(
        {
          results: [{}],
        },
        '2026-03-03',
      ),
    ).resolves.toEqual({
      results: [{ legacyId: 'legacy-123' }],
    });

    expect(prepareContext).toHaveBeenCalledTimes(1);
    expect(events).toEqual(['prepare', 'change']);
  });
});

class ThrowingDowngradeChange extends CustomTransformChange {
  description = 'Throws on downgrade';
  override payloadPath = '/results/*' as const;

  protected override schemaPatchSet() {
    return {
      seoUrl: z.string(),
    };
  }

  override async downgrade() {
    throw new Error('boom');
  }
}

class TypeDiscriminatedPlaceChange extends CustomTransformChange {
  override description =
    'replace place schema with type-discriminated branches';
  override payloadPath = '/results/*' as const;

  protected override schemaPatchReplace() {
    return z.discriminatedUnion('type', [
      z
        .object({
          type: z.literal('fixedLocation'),
          location: z.object({ address: z.string() }),
          schedule: z.object({ status: z.string() }),
        })
        .passthrough(),
      z
        .object({
          type: z.literal('itinerary'),
          stops: z.array(
            z.object({
              location: z.object({ address: z.string() }),
              schedule: z.object({ status: z.string() }),
            }),
          ),
        })
        .passthrough(),
    ]);
  }

  override downgrade(container: Record<string, unknown>) {
    if (container.type === 'fixedLocation') {
      if (!container.location || !container.schedule) {
        throw new Error('fixedLocation requires location and schedule');
      }

      container.placeType = 'LIEU';
      container.position = container.location;
      container.newhours = container.schedule;
      delete container.type;
      delete container.location;
      delete container.schedule;
      return;
    }

    if (container.type === 'itinerary') {
      if (!Array.isArray(container.stops)) {
        throw new Error('itinerary requires stops');
      }

      container.placeType = 'PARCOURS_MOBILE';
      container.parcours = container.stops.map((stop) => ({
        position: (stop as Record<string, unknown>).location,
        hours: (stop as Record<string, unknown>).schedule,
      }));
      delete container.type;
      delete container.stops;
      return;
    }

    throw new Error('Unknown type');
  }
}

class ContextAwareLegacyIdChange extends RemoveFieldChange {
  override description = 'restore legacyId from prepared context';
  override payloadPath = '/results/*' as const;
  override field = 'legacyId';

  constructor(private readonly events: string[]) {
    super();
  }

  override downgrade(
    _container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ) {
    this.events.push('change');
    return context?.legacyId;
  }
}
