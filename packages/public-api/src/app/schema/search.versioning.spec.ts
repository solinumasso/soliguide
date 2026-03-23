import { VersionRegistry, DslCompiler } from '../../api-versioning/versioning';
import { RequestOpenApiProjector } from '../../api-versioning/artifacts/openapi/request-openapi.projector';
import { ResponseOpenApiProjector } from '../../api-versioning/artifacts/openapi/response-openapi.projector';
import { searchVersion20260303 } from '../versions/20260303.version';
import { searchVersion20260309 } from '../versions/20260309.version';
import {
  searchVersions,
  searchVersioningDefinition,
  searchOpenApiOperationTarget,
} from './search.versioning';

describe('Search versioning configuration', () => {
  it('composes versions from per-version files in chronological order', () => {
    expect(searchVersions).toEqual([
      searchVersion20260303,
      searchVersion20260309,
    ]);

    const registry = new VersionRegistry(
      searchVersioningDefinition,
      new DslCompiler(),
    );

    expect(registry.supportedVersions).toEqual(['2026-03-03', '2026-03-09']);
    expect(registry.canonicalVersion).toBe('2026-03-09');
  });

  it('declares the openapi operation target used for search artifacts', () => {
    expect(searchOpenApiOperationTarget).toEqual({
      method: 'get',
      path: '/search',
    });
  });

  it('projects generated base OpenAPI schemas across versions', () => {
    const registry = new VersionRegistry(
      searchVersioningDefinition,
      new DslCompiler(),
    );
    const requestProjector = new RequestOpenApiProjector(registry);
    const responseProjector = new ResponseOpenApiProjector(registry);

    const requestCache = requestProjector.buildRequestSchemaCache(
      searchVersioningDefinition.baseRequestOpenApiSchema,
    );
    const responseCache = responseProjector.buildResponseSchemaCache(
      searchVersioningDefinition.baseResponseOpenApiSchema,
    );

    const requestV20260303 = asRecord(requestCache.get('2026-03-03'));
    const requestV20260309 = asRecord(requestCache.get('2026-03-09'));
    const requestOldProperties = asRecord(requestV20260303.properties);
    const requestCanonicalProperties = asRecord(requestV20260309.properties);

    expect(requestOldProperties).toHaveProperty('openToday');
    expect(requestOldProperties).not.toHaveProperty('isOpenToday');
    expect(requestCanonicalProperties).toHaveProperty('isOpenToday');
    expect(requestCanonicalProperties).not.toHaveProperty('openToday');

    const responseV20260303 = asRecord(responseCache.get('2026-03-03'));
    const responseV20260309 = asRecord(responseCache.get('2026-03-09'));
    const oldResultsSchema = asRecord(
      asRecord(responseV20260303.properties).results,
    );
    const canonicalResultsSchema = asRecord(
      asRecord(responseV20260309.properties).results,
    );
    const oldItemSchema = asRecord(oldResultsSchema.items);
    const canonicalItemSchema = asRecord(canonicalResultsSchema.items);
    const oldItemProperties = asRecord(oldItemSchema.properties);
    const canonicalItemProperties = asRecord(canonicalItemSchema.properties);

    expect(oldItemProperties).toHaveProperty('slug');
    expect(oldItemProperties).not.toHaveProperty('seoUrl');
    expect(asRecord(oldItemProperties.name).type).toBe('string');

    expect(canonicalItemProperties).toHaveProperty('seoUrl');
    expect(canonicalItemProperties).not.toHaveProperty('slug');
    expect(asRecord(canonicalItemProperties.name).type).toBe('object');
  });
});

function asRecord(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}
