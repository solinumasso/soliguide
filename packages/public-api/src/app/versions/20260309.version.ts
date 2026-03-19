import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import {
  apiProperty,
  rawProperty,
} from '../../api-versioning/artifacts/openapi/openapi.dsl';
import {
  RenameFieldRequestChange,
  RenameFieldResponseChange,
  ReplaceFieldResponseChange,
  Version,
  defineVersion,
} from '../../api-versioning/versioning';
import {
  baseSearchRequestOpenApiSchema,
  baseSearchRequestSchema,
  baseSearchResponseOpenApiSchema,
  baseSearchResponseSchema,
} from '../schema/search.base';

type SearchRequestPayload = z.infer<typeof baseSearchRequestSchema>;
type SearchRequestOpenApiSchema = typeof baseSearchRequestOpenApiSchema;
type SearchResponsePayload = z.infer<typeof baseSearchResponseSchema>;
type SearchResponseOpenApiSchema = typeof baseSearchResponseOpenApiSchema;
type SearchResponseItem = SearchResponsePayload['results'][number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@Injectable()
export class RenameOpenToday extends RenameFieldRequestChange<
  SearchRequestPayload,
  SearchRequestOpenApiSchema
> {
  override description =
    'Renamed request query field openToday to isOpenToday.';
  override from = 'openToday' as const;
  override to = 'isOpenToday';

  protected override getZodSchema() {
    return z.coerce.boolean().optional();
  }

  protected override getOpenApiProperty() {
    return apiProperty({
      type: Boolean,
      required: false,
      description: 'Filter places open today.',
    });
  }
}

@Injectable()
export class RenameSlugToSeoUrl extends RenameFieldResponseChange<
  SearchResponsePayload,
  SearchResponseOpenApiSchema,
  SearchResponseItem
> {
  override description = 'Renamed response field slug to seoUrl.';
  override from = 'slug' as const;
  override to = 'seoUrl';
  override payloadPath = '/results/*' as const;
  override openApiPath = '/properties/results/items' as const;

  protected override getZodSchema() {
    return z.string();
  }

  protected override getOpenApiProperty() {
    return apiProperty({
      type: String,
      description: 'URL-friendly identifier of the place',
      example: 'croix-rouge-francaise-antenne-locale-de-saint-benoit-43510',
      nullable: false,
      required: true,
    });
  }
}

@Injectable()
export class ExpandNameToCanonicalName extends ReplaceFieldResponseChange<
  SearchResponsePayload,
  SearchResponseOpenApiSchema,
  SearchResponseItem
> {
  override description =
    'Expanded response field name from string to object containing original and translated names.';
  override field = 'name' as const;
  override payloadPath = '/results/*' as const;
  override openApiPath = '/properties/results/items' as const;

  protected override getZodSchema() {
    return z
      .object({
        originalName: z.string(),
        translatedName: z.string(),
      })
      .strict();
  }

  protected override getOpenApiProperty() {
    return rawProperty(
      {
        type: 'object',
        additionalProperties: false,
        required: ['originalName', 'translatedName'],
        properties: {
          originalName: {
            type: 'string',
            description: 'Original name of the place',
          },
          translatedName: {
            type: 'string',
            description: 'Localized place name in the requested language',
          },
        },
      },
      { required: true },
    );
  }

  protected override downgradeValueMapper(value: {
    translatedName: string;
    originalName: string;
  }) {
    if (!isRecord(value)) {
      return value;
    }

    if (typeof value.translatedName === 'string') {
      return value.translatedName;
    }

    if (typeof value.originalName === 'string') {
      return value.originalName;
    }

    return value;
  }
}

@Injectable()
export class SearchVersion20260309Provider {
  constructor(
    private readonly renameOpenTodayChange: RenameOpenToday,
    private readonly renameSlugToSeoUrlChange: RenameSlugToSeoUrl,
    private readonly expandNameToCanonicalNameChange: ExpandNameToCanonicalName,
  ) {}

  toVersion(): Version {
    return defineVersion({
      version: '2026-03-09',
      description:
        'Renamed fields for clearer semantics and richer naming payload.',
      requestChanges: [this.renameOpenTodayChange],
      responseChanges: [
        this.renameSlugToSeoUrlChange,
        this.expandNameToCanonicalNameChange,
      ],
    });
  }
}

export const searchVersion20260309 = defineVersion({
  version: '2026-03-09',
  description:
    'Renamed fields for clearer semantics and richer naming payload.',
  requestChanges: [new RenameOpenToday()],
  responseChanges: [new RenameSlugToSeoUrl(), new ExpandNameToCanonicalName()],
});

export const searchVersion20260309ChangeProviders = [
  RenameOpenToday,
  RenameSlugToSeoUrl,
  ExpandNameToCanonicalName,
];
export const searchVersion20260309VersionProviders = [
  SearchVersion20260309Provider,
];
