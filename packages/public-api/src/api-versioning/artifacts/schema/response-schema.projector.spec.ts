import { DslCompiler } from '../../versioning/dsl-compiler';
import { ResponseSchemaProjector } from './response-schema.projector';
import { catalogVersioningDefinition } from '../../testing';
import { VersionRegistry } from '../../versioning/version-registry';

describe('ProposalC ResponseSchemaProjector', () => {
  it('builds per-version response schema snapshots by replaying base-forward patches', () => {
    const registry = new VersionRegistry(
      catalogVersioningDefinition,
      new DslCompiler(),
    );
    const projector = new ResponseSchemaProjector(registry);

    const cache = projector.buildResponseSchemaCache(
      registry.definition.baseResponseSchema,
    );

    const v20260303Schema = cache.get('2026-03-03');
    const v20260309Schema = cache.get('2026-03-09');

    const oldParsed = v20260303Schema?.safeParse({
      _links: {
        self: { href: '/' },
        next: { href: '/' },
        prev: { href: '/' },
      },
      results: [
        {
          id: '1',
          slug: 'slug',
          name: 'Name',
          summary: 'd',
          type: 'book',
          isOpenToday: true,
          languages: ['fr'],
        },
      ],
      page: {
        current: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      },
    });

    const canonicalParsed = v20260309Schema?.safeParse({
      _links: {
        self: { href: '/' },
        next: { href: '/' },
        prev: { href: '/' },
      },
      results: [
        {
          id: '1',
          seoUrl: 'slug',
          name: {
            originalName: 'Name',
            translatedName: 'Name',
          },
          summary: 'd',
          type: 'book',
          isOpenToday: true,
          languages: ['fr'],
        },
      ],
      page: {
        current: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      },
    });

    expect(oldParsed?.success).toBe(true);
    expect(canonicalParsed?.success).toBe(true);
  });
});
