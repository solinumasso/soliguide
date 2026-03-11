import { DslCompiler } from '../../versioning/dsl-compiler';
import { RequestOpenApiProjector } from './request-openapi.projector';
import { searchVersioningDefinition } from '../../app/search';
import { VersionRegistry } from '../../versioning/version-registry';
import type { OpenApiPropertySchema } from '../../versioning/versioning.types';

function getProperties(schema: OpenApiPropertySchema): Record<string, unknown> {
  return (schema['properties'] ?? {}) as Record<string, unknown>;
}

describe('ProposalC RequestOpenApiProjector', () => {
  it('builds per-version request snapshots by replaying base-forward operations', () => {
    const registry = new VersionRegistry(
      searchVersioningDefinition,
      new DslCompiler(),
    );
    const projector = new RequestOpenApiProjector(registry);
    const cache = projector.buildRequestSchemaCache(
      registry.definition.baseRequestOpenApiSchema,
    );

    const v20260303 = cache.get('2026-03-03') as OpenApiPropertySchema;
    const v20260309 = cache.get('2026-03-09') as OpenApiPropertySchema;

    expect(getProperties(v20260303)).toHaveProperty('openToday');
    expect(getProperties(v20260303)).not.toHaveProperty('isOpenToday');

    expect(getProperties(v20260309)).toHaveProperty('isOpenToday');
    expect(getProperties(v20260309)).not.toHaveProperty('openToday');
  });
});
