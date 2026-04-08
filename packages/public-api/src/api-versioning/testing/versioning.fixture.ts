import { Controller, Get, Module } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { RenameFieldChange, ReplaceFieldChange } from '../versioning/changes';
import { DslCompiler } from '../versioning/dsl/dsl-compiler';
import { VersionRegistry } from '../versioning/version-registry';
import { applySchemaPatch } from './zod-schema-cache.utils';
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

const v20260303: Version = {
  version: '2026-03-03',
  description: 'Initial catalog API version.',
  requestChanges: [],
  responseChanges: [],
};

class RenameRequestOpenToday extends RenameFieldChange {
  description = 'Renamed request field openToday to isOpenToday.';
  from = 'openToday';
  to = 'isOpenToday';
  schema = z.coerce.boolean().optional();

  override upgrade(value: unknown) {
    return typeof value === 'boolean' ? value : Boolean(value);
  }
}

class RenameResponseSlug extends RenameFieldChange {
  description = 'Renamed response field slug to seoUrl.';
  override payloadPath = '/results/*' as const;
  from = 'slug';
  to = 'seoUrl';
  schema = z
    .string()
    .describe('URL-friendly identifier of the item.')
    .meta({ example: 'atelier-ecriture-123' });
}

class ExpandResponseName extends ReplaceFieldChange {
  description =
    'Expanded response field name from string to object with original and translated values.';
  override payloadPath = '/results/*' as const;
  field = 'name';
  schema = z
    .object({
      originalName: z.string().describe('Original name'),
      translatedName: z.string().describe('Translated name'),
    })
    .strict();

  override downgrade(value: unknown) {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    if ('translatedName' in value && typeof value.translatedName === 'string') {
      return value.translatedName;
    }

    if ('originalName' in value && typeof value.originalName === 'string') {
      return value.originalName;
    }

    return value;
  }
}

const v20260309: Version = {
  version: '2026-03-09',
  description: 'Introduced clearer fields for request and response payloads.',
  requestChanges: [new RenameRequestOpenToday()],
  responseChanges: [new RenameResponseSlug(), new ExpandResponseName()],
};

export const catalogVersions: readonly Version[] = [v20260303, v20260309];

export const catalogVersioningDefinition: VersioningDefinition = {
  resource: 'catalog',
  versions: catalogVersions,
  baseRequestSchema,
  baseResponseSchema,
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
  let requestSchema = definition.baseRequestSchema;
  let responseSchema = definition.baseResponseSchema;
  const requestSchemasByVersion = new Map<ApiVersion, z.ZodTypeAny>();
  const responseSchemasByVersion = new Map<ApiVersion, z.ZodTypeAny>();

  for (const version of registry.compiledVersions) {
    for (const change of version.requestChanges) {
      requestSchema = applySchemaPatch(requestSchema, change.schemaPatch);
    }

    for (const change of version.responseChanges) {
      responseSchema = applySchemaPatch(responseSchema, change.schemaPatch);
    }

    requestSchemasByVersion.set(version.version, requestSchema);
    responseSchemasByVersion.set(version.version, responseSchema);
  }

  return {
    requestSchemasByVersion,
    responseSchemasByVersion,
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
