import { z } from 'zod';

export const baseSearchRequestSchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    openToday: z.coerce.boolean().optional(),
  })
  .strict();

export const baseSearchRequestOpenApiSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
    openToday: { type: 'boolean' },
  },
};

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
          name: z.string(),
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

export const baseSearchResponseOpenApiSchema = {
  type: 'object',
  required: ['_links', 'results', 'page'],
  additionalProperties: false,
  properties: {
    _links: {
      type: 'object',
      required: ['self', 'next', 'prev'],
      additionalProperties: false,
      properties: {
        self: {
          type: 'object',
          required: ['href'],
          properties: {
            href: { type: 'string' },
          },
        },
        next: {
          type: 'object',
          required: ['href'],
          properties: {
            href: { type: 'string' },
          },
        },
        prev: {
          type: 'object',
          required: ['href'],
          properties: {
            href: { type: 'string' },
          },
        },
      },
    },
    results: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'id',
          'slug',
          'name',
          'description',
          'type',
          'isOpenToday',
          'languages',
        ],
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          name: {
            type: 'string',
            description: 'Localized place name in the requested language',
            example: 'French Red Cross - Saint Benoit Local Branch',
          },
          description: { type: 'string' },
          type: {
            type: 'string',
            enum: ['place', 'itinerary'],
          },
          isOpenToday: { type: 'boolean' },
          languages: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
    page: {
      type: 'object',
      additionalProperties: false,
      required: ['current', 'limit', 'totalPages', 'totalResults'],
      properties: {
        current: { type: 'integer', minimum: 1 },
        limit: { type: 'integer', minimum: 1 },
        totalPages: { type: 'integer', minimum: 1 },
        totalResults: { type: 'integer', minimum: 0 },
      },
    },
  },
};
