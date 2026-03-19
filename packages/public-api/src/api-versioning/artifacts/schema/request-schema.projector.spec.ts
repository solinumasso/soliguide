/* eslint-disable @typescript-eslint/ban-ts-comment */
import { z } from 'zod';
import { rawProperty } from '../openapi/openapi.dsl';
import { DslCompiler } from '../../versioning/dsl-compiler';
import { RequestSchemaProjector } from './request-schema.projector';
import { catalogVersioningDefinition } from '../../testing';
import { VersionRegistry } from '../../versioning/version-registry';

describe('ProposalC RequestSchemaProjector', () => {
  it('builds per-version request schema snapshots by replaying base-forward patches', () => {
    const registry = new VersionRegistry(
      catalogVersioningDefinition,
      new DslCompiler(),
    );
    const projector = new RequestSchemaProjector(registry);

    const cache = projector.buildRequestSchemaCache(
      registry.definition.baseRequestSchema,
    );

    const v20260303Schema = cache.get('2026-03-03');
    const v20260309Schema = cache.get('2026-03-09');

    expect(v20260303Schema?.safeParse({ openToday: true }).success).toBe(true);
    expect(v20260303Schema?.safeParse({ isOpenToday: true }).success).toBe(
      false,
    );

    expect(v20260309Schema?.safeParse({ isOpenToday: true }).success).toBe(
      true,
    );
    expect(v20260309Schema?.safeParse({ openToday: true }).success).toBe(false);
  });

  it('throws when a schema patch path cannot be resolved', () => {
    const invalidDefinition = {
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
          description: 'Invalid',
          requestChanges: [
            {
              description: 'Invalid payloadPath',
              operation: {
                kind: 'addField' as const,
                field: 'x',
                payloadPath: '/unknown',
                spec: {
                  zod: z.string(),
                  openApi: {
                    schema: { type: 'string' },
                    required: false,
                  },
                },
              },
            },
          ],
          responseChanges: [],
        },
      ],
    };

    // @ts-ignore
    const registry = new VersionRegistry(invalidDefinition, new DslCompiler());
    const projector = new RequestSchemaProjector(registry);

    expect(() =>
      projector.buildRequestSchemaCache(registry.definition.baseRequestSchema),
    ).toThrow('Missing segment "unknown"');
  });

  it('preserves array-level constraints when patching array item schemas', () => {
    const definition = {
      resource: 'request-array-constraints',
      baseRequestSchema: z
        .object({
          results: z
            .array(
              z
                .object({
                  slug: z.string(),
                })
                .strict(),
            )
            .min(1),
        })
        .strict(),
      baseResponseSchema: z.object({}).strict(),
      baseRequestOpenApiSchema: {
        type: 'object',
        properties: {
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                slug: { type: 'string' },
              },
            },
          },
        },
      },
      baseResponseOpenApiSchema: {
        type: 'object',
        properties: {},
      },
      versions: [
        {
          version: '2026-03-03',
          description: 'Initial',
          requestChanges: [],
          responseChanges: [],
        },
        {
          version: '2026-03-09',
          description: 'Rename slug in array items',
          requestChanges: [
            {
              description: 'Rename item slug to seoUrl',
              operation: {
                kind: 'renameField' as const,
                from: 'slug',
                to: 'seoUrl',
                payloadPath: '/results/*',
                openApiPath: '/properties/results/items',
                toSpec: {
                  zod: z.string(),
                  openApi: rawProperty({ type: 'string' }, { required: true }),
                },
              },
            },
          ],
          responseChanges: [],
        },
      ],
    };

    // @ts-ignore
    const registry = new VersionRegistry(definition, new DslCompiler());
    const projector = new RequestSchemaProjector(registry);
    const cache = projector.buildRequestSchemaCache(
      registry.definition.baseRequestSchema,
    );
    const canonicalSchema = cache.get('2026-03-09');

    expect(canonicalSchema?.safeParse({ results: [] }).success).toBe(false);
    expect(
      canonicalSchema?.safeParse({
        results: [{ seoUrl: 'my-slug' }],
      }).success,
    ).toBe(true);
  });
});
