import { DslCompiler } from '../versioning/dsl-compiler';
import {
  requestSchemasByVersion,
  responseSchemasByVersion,
} from '../generated/contracts';
import { RequestOpenApiProjector } from '../projection/openapi/request-openapi.projector';
import { RequestSchemaProjector } from '../projection/schema/request-schema.projector';
import { RequestVersioningPipeline } from './request-versioning.pipeline';
import { ResponseOpenApiProjector } from '../projection/openapi/response-openapi.projector';
import { ResponseSchemaProjector } from '../projection/schema/response-schema.projector';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';
import {
  searchOpenApiOperationTarget,
  searchVersioningDefinition,
} from '../app/search';
import { VersioningEngine } from './versioning.engine';
import { VersionRegistry } from '../versioning/version-registry';
import { VersionResolver } from '../versioning/version-resolver';

describe('ProposalC VersioningEngine', () => {
  const buildEngine = (): VersioningEngine => {
    const registry = new VersionRegistry(
      searchVersioningDefinition,
      new DslCompiler(),
    );
    const resolver = new VersionResolver();

    const requestOpenApiProjector = new RequestOpenApiProjector(registry);
    const responseOpenApiProjector = new ResponseOpenApiProjector(registry);
    const requestSchemaProjector = new RequestSchemaProjector(registry);
    const responseSchemaProjector = new ResponseSchemaProjector(registry);

    const requestPipeline = new RequestVersioningPipeline(
      registry,
      resolver,
      requestSchemasByVersion,
    );
    const responsePipeline = new ResponseVersioningPipeline(registry, resolver);

    return new VersioningEngine(
      registry,
      resolver,
      requestPipeline,
      responsePipeline,
      requestOpenApiProjector,
      responseOpenApiProjector,
      requestSchemaProjector,
      responseSchemaProjector,
      searchOpenApiOperationTarget,
      requestSchemasByVersion,
      responseSchemasByVersion,
    );
  };

  it('upgrades request payloads to canonical form', async () => {
    const engine = buildEngine();

    await expect(
      engine.upgradeRequest({ openToday: true }, '2026-03-03'),
    ).resolves.toEqual({ isOpenToday: true });
  });

  it('downgrades response payloads to the requested client version', async () => {
    const engine = buildEngine();

    const canonicalPayload = {
      _links: {
        self: { href: '/search?page=1&limit=100' },
        next: { href: '/search?page=1&limit=100' },
        prev: { href: '/search?page=1&limit=100' },
      },
      results: [
        {
          id: '43510',
          seoUrl: 'seo-url',
          name: {
            originalName: 'Original',
            translatedName: 'Translated',
          },
          description: 'Description',
          type: 'place',
          isOpenToday: true,
          languages: ['fr'],
        },
      ],
      page: {
        current: 1,
        limit: 100,
        totalPages: 1,
        totalResults: 1,
      },
    };

    await expect(
      engine.downgradeResponse(canonicalPayload, '2026-03-03'),
    ).resolves.toEqual({
      _links: canonicalPayload._links,
      results: [
        {
          id: '43510',
          slug: 'seo-url',
          name: 'Translated',
          description: 'Description',
          type: 'place',
          isOpenToday: true,
          languages: ['fr'],
        },
      ],
      page: canonicalPayload.page,
    });
  });

  it('returns request and response schemas for a specific version', () => {
    const engine = buildEngine();

    const requestSchema = engine.getRequestSchema('2026-03-03');
    const responseSchema = engine.getResponseSchema('2026-03-03');

    expect(requestSchema.safeParse({ openToday: true }).success).toBe(true);
    expect(requestSchema.safeParse({ isOpenToday: true }).success).toBe(false);

    expect(
      responseSchema.safeParse({
        _links: {
          self: { href: '/' },
          next: { href: '/' },
          prev: { href: '/' },
        },
        results: [
          {
            id: '1',
            slug: 'slug',
            name: 'name',
            description: 'd',
            type: 'place',
            isOpenToday: true,
            languages: ['fr'],
          },
        ],
        page: {
          current: 1,
          limit: 20,
          totalPages: 1,
          totalResults: 1,
        },
      }).success,
    ).toBe(true);
  });
});
