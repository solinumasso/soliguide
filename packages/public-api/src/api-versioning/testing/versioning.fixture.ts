import { Controller, Get, Module } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { RequestSchemaProjector } from '../artifacts/schema/request-schema.projector';
import { ResponseSchemaProjector } from '../artifacts/schema/response-schema.projector';
import { rawProperty } from '../artifacts/openapi/openapi.dsl';
import { DslCompiler } from '../versioning/dsl-compiler';
import { VersionRegistry } from '../versioning/version-registry';
import type {
  ApiVersion,
  OpenApiOperationTarget,
  ValidationSchemaCache,
  Version,
  VersioningDefinition,
} from '../versioning/versioning.types';

const itemTypeSchema = z.enum(['book', 'guide']);

const baseRequestSchema = z
  .object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    openToday: z.coerce.boolean().optional(),
  })
  .strict();

const baseRequestOpenApiSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    page: { type: 'integer', minimum: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100 },
    openToday: { type: 'boolean' },
  },
};

const baseResponseSchema = z
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
          summary: z.string(),
          type: itemTypeSchema,
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

const baseResponseOpenApiSchema = {
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
          'summary',
          'type',
          'isOpenToday',
          'languages',
        ],
        properties: {
          id: { type: 'string' },
          slug: { type: 'string' },
          name: { type: 'string' },
          summary: { type: 'string' },
          type: {
            type: 'string',
            enum: ['book', 'guide'],
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

const v20260303: Version = {
  version: '2026-03-03',
  description: 'Initial catalog API version.',
  requestChanges: [],
  responseChanges: [],
};

const v20260309: Version = {
  version: '2026-03-09',
  description: 'Introduced clearer fields for request and response payloads.',
  requestChanges: [
    {
      description: 'Renamed request field openToday to isOpenToday.',
      operation: {
        kind: 'renameField',
        from: 'openToday',
        to: 'isOpenToday',
        toSpec: {
          zod: z.coerce.boolean().optional(),
          openApi: rawProperty({ type: 'boolean' }, { required: false }),
        },
      },
    },
  ],
  responseChanges: [
    {
      description: 'Renamed response field slug to seoUrl.',
      operation: {
        kind: 'renameField',
        from: 'slug',
        to: 'seoUrl',
        payloadPath: '/results/*',
        openApiPath: '/properties/results/items',
        toSpec: {
          zod: z.string(),
          openApi: rawProperty(
            {
              type: 'string',
              description: 'URL-friendly identifier of the item.',
              example: 'atelier-ecriture-123',
            },
            { required: true },
          ),
        },
      },
    },
    {
      description:
        'Expanded response field name from string to object with original and translated values.',
      operation: {
        kind: 'replaceField',
        field: 'name',
        payloadPath: '/results/*',
        openApiPath: '/properties/results/items',
        spec: {
          zod: z
            .object({
              originalName: z.string(),
              translatedName: z.string(),
            })
            .strict(),
          openApi: rawProperty(
            {
              type: 'object',
              additionalProperties: false,
              required: ['originalName', 'translatedName'],
              properties: {
                originalName: { type: 'string' },
                translatedName: { type: 'string' },
              },
            },
            { required: true },
          ),
        },
        mapValue: (value: unknown) => {
          if (typeof value !== 'string') {
            return value;
          }

          return {
            originalName: value,
            translatedName: value,
          };
        },
        downgradeValue: (value: unknown) => {
          if (typeof value !== 'object' || value === null) {
            return value;
          }

          if (
            'translatedName' in value &&
            typeof value.translatedName === 'string'
          ) {
            return value.translatedName;
          }

          if (
            'originalName' in value &&
            typeof value.originalName === 'string'
          ) {
            return value.originalName;
          }

          return value;
        },
      },
    },
  ],
};

export const catalogVersions: readonly Version[] = [v20260303, v20260309];

export const catalogVersioningDefinition: VersioningDefinition = {
  resource: 'catalog',
  versions: catalogVersions,
  baseRequestSchema,
  baseResponseSchema,
  baseRequestOpenApiSchema,
  baseResponseOpenApiSchema,
};

export const catalogOpenApiOperationTarget: OpenApiOperationTarget = {
  method: 'get',
  path: '/catalog',
};

export const catalogCanonicalResponse = {
  _links: {
    self: { href: '/catalog?page=1&limit=10' },
    next: { href: '/catalog?page=1&limit=10' },
    prev: { href: '/catalog?page=1&limit=10' },
  },
  results: [
    {
      id: '42',
      seoUrl: 'atelier-ecriture-123',
      name: {
        originalName: 'Atelier d ecriture',
        translatedName: 'Writing workshop',
      },
      summary: 'Creative writing support',
      type: 'book',
      isOpenToday: true,
      languages: ['fr', 'en'],
    },
  ],
  page: {
    current: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 1,
  },
} as const;

export const expectedLegacyResponse = {
  _links: catalogCanonicalResponse._links,
  results: [
    {
      id: '42',
      slug: 'atelier-ecriture-123',
      name: 'Writing workshop',
      summary: 'Creative writing support',
      type: 'book',
      isOpenToday: true,
      languages: ['fr', 'en'],
    },
  ],
  page: catalogCanonicalResponse.page,
} as const;

export function buildSchemaCaches(
  definition: VersioningDefinition = catalogVersioningDefinition,
): {
  requestSchemasByVersion: ValidationSchemaCache;
  responseSchemasByVersion: ValidationSchemaCache;
  supportedVersions: readonly ApiVersion[];
} {
  const registry = new VersionRegistry(definition, new DslCompiler());
  const requestSchemaProjector = new RequestSchemaProjector(registry);
  const responseSchemaProjector = new ResponseSchemaProjector(registry);

  return {
    requestSchemasByVersion: requestSchemaProjector.buildRequestSchemaCache(
      definition.baseRequestSchema,
    ),
    responseSchemasByVersion: responseSchemaProjector.buildResponseSchemaCache(
      definition.baseResponseSchema,
    ),
    supportedVersions: registry.supportedVersions,
  };
}

@ApiTags('catalog-fixture')
@Controller('catalog')
class CatalogFixtureController {
  @Get()
  @ApiOperation({
    operationId: 'catalog_search',
    summary: 'Search catalog entries',
  })
  @ApiOkResponse({
    description: 'Successful catalog response',
  })
  search(): Record<string, never> {
    return {};
  }
}

@Module({
  controllers: [CatalogFixtureController],
})
export class CatalogFixtureModule {}
