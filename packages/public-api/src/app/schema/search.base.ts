import { z } from 'zod';
import { zodSchemaToOpenApiSchema } from '../../api-versioning/artifacts/openapi/openapi.dsl';
import type { OpenApiPropertySchema } from '../../api-versioning/versioning/versioning.types';

export const baseSearchRequestSchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    openToday: z.coerce.boolean().optional(),
  })
  .strict();

export const baseSearchResponseSchema = z
  .object({
    _links: z
      .object({
        self: z.object({ href: z.string() }).strict(),
        next: z.object({ href: z.string() }).strict(),
        prev: z.object({ href: z.string() }).strict(),
      })
      .strict(),
    results: z.array(
      z
        .object({
          id: z.string(),
          slug: z.string(),
          name: z
            .string()
            .describe('Localized place name in the requested language')
            .meta({
              example: 'French Red Cross - Saint Benoit Local Branch',
            }),
          description: z.string(),
          type: z.enum(['place', 'itinerary']),
          isOpenToday: z.boolean(),
          languages: z.array(z.string()),
        })
        .strict(),
    ),
    page: z
      .object({
        current: z.number().int().min(1),
        limit: z.number().int().min(1),
        totalPages: z.number().int().min(1),
        totalResults: z.number().int().min(0),
      })
      .strict(),
  })
  .strict();

export const baseSearchRequestOpenApiSchema: OpenApiPropertySchema =
  zodSchemaToOpenApiSchema(baseSearchRequestSchema);

export const baseSearchResponseOpenApiSchema: OpenApiPropertySchema =
  zodSchemaToOpenApiSchema(baseSearchResponseSchema);
