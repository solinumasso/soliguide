import {
  baseSearchRequestOpenApiSchema,
  baseSearchResponseOpenApiSchema,
} from './search.base';

function asRecord(value: unknown): Record<string, unknown> {
  return value as Record<string, unknown>;
}

describe('Search base OpenAPI schema', () => {
  it('generates request schema from zod and strips implicit integer maximum', () => {
    const requestSchema = asRecord(baseSearchRequestOpenApiSchema);
    const requestProperties = asRecord(requestSchema.properties);
    const pageSchema = asRecord(requestProperties.page);
    const limitSchema = asRecord(requestProperties.limit);

    expect(requestSchema.type).toBe('object');
    expect(requestSchema.additionalProperties).toBe(false);
    expect(pageSchema.maximum).toBeUndefined();
    expect(limitSchema.maximum).toBe(100);
  });

  it('preserves response metadata in generated OpenAPI schema', () => {
    const responseSchema = asRecord(baseSearchResponseOpenApiSchema);
    const responseProperties = asRecord(responseSchema.properties);
    const resultsSchema = asRecord(responseProperties.results);
    const itemSchema = asRecord(resultsSchema.items);
    const itemProperties = asRecord(itemSchema.properties);
    const nameSchema = asRecord(itemProperties.name);

    expect(nameSchema.description).toBe(
      'Localized place name in the requested language',
    );
    expect(nameSchema.example).toBe(
      'French Red Cross - Saint Benoit Local Branch',
    );
  });

  it('keeps nested object schemas patchable for version projections', () => {
    const responseSchema = asRecord(baseSearchResponseOpenApiSchema);
    const responseProperties = asRecord(responseSchema.properties);
    const linksSchema = asRecord(responseProperties._links);
    const linksProperties = asRecord(linksSchema.properties);
    const selfSchema = asRecord(linksProperties.self);

    expect(linksSchema).toHaveProperty('properties');
    expect(selfSchema).toHaveProperty('properties');
    expect(selfSchema.additionalProperties).toBe(false);
  });
});
