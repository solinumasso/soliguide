import { DslCompiler } from '../../versioning/dsl-compiler';
import { ResponseOpenApiProjector } from './response-openapi.projector';
import { catalogVersioningDefinition } from '../../testing';
import { VersionRegistry } from '../../versioning/version-registry';
import type { OpenApiPropertySchema } from '../../versioning/versioning.types';

function getResultItemSchema(
  schema: OpenApiPropertySchema,
): Record<string, unknown> {
  return (
    (schema['properties'] as Record<string, unknown>)?.results as Record<
      string,
      unknown
    >
  )?.items as Record<string, unknown>;
}

describe('ResponseOpenApiProjector', () => {
  it('builds per-version response snapshots by replaying base-forward operations', () => {
    const registry = new VersionRegistry(
      catalogVersioningDefinition,
      new DslCompiler(),
    );
    const projector = new ResponseOpenApiProjector(registry);
    const cache = projector.buildResponseSchemaCache(
      registry.definition.baseResponseOpenApiSchema,
    );

    const v20260303 = cache.get('2026-03-03') as OpenApiPropertySchema;
    const v20260309 = cache.get('2026-03-09') as OpenApiPropertySchema;

    const oldItem = getResultItemSchema(v20260303);
    const canonicalItem = getResultItemSchema(v20260309);

    const oldProperties = oldItem.properties as Record<string, unknown>;
    const canonicalProperties = canonicalItem.properties as Record<
      string,
      unknown
    >;

    expect(oldProperties).toHaveProperty('slug');
    expect(oldProperties).not.toHaveProperty('seoUrl');
    expect((oldProperties.name as Record<string, unknown>).type).toBe('string');

    expect(canonicalProperties).toHaveProperty('seoUrl');
    expect(canonicalProperties).not.toHaveProperty('slug');
    expect((canonicalProperties.name as Record<string, unknown>).type).toBe(
      'object',
    );
  });
});
