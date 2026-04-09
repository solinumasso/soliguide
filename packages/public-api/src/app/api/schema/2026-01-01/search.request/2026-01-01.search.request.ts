import {
  Categories,
  GeoTypes,
  PLACE_LANGUAGES_LIST_MAP_KEY,
  PlaceType,
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
  SUPPORTED_LANGUAGES,
  UpdatedAtInterval,
  WelcomedPublics,
  WIDGETS_AVAILABLE,
} from '@soliguide/common';
import { z } from 'zod';

const locationSchema = z.looseObject({
  geoType: z
    .enum(GeoTypes)
    .describe('Geographic mode used by the search location.'),
  geoValue: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Geographic identifier for non-position searches (country, region, department, city, etc.).',
    ),
  coordinates: z
    .array(z.coerce.number())
    .length(2)
    .nullable()
    .optional()
    .describe('Longitude/latitude coordinates used when geoType is position.'),
  distance: z.coerce
    .number()
    .nullable()
    .optional()
    .describe('Search radius in kilometers for position-based search.'),
  label: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  regionCode: z.string().nullable().optional(),
  departmentCode: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  country: z
    .string()
    .nullable()
    .optional()
    .describe(
      'Country code. Restricted to Soliguide countries for non-API users.',
    ),
});

const modalitiesSchema = z
  .looseObject({
    animal: z.coerce.boolean().nullable().optional(),
    appointment: z.coerce.boolean().nullable().optional(),
    inconditionnel: z.coerce.boolean().nullable().optional(),
    inscription: z.coerce.boolean().nullable().optional(),
    orientation: z.coerce.boolean().nullable().optional(),
    pmr: z.coerce.boolean().nullable().optional(),
    price: z.coerce.boolean().nullable().optional(),
    sign: z.coerce.boolean().nullable().optional(),
  })
  .catchall(z.unknown())
  .describe(
    'Legacy modalities filter. Unknown extra keys are accepted by the route.',
  );

const publicsSchema = z
  .looseObject({
    accueil: z.enum(WelcomedPublics).nullable().optional(),
    age: z.coerce.number().int().min(0).max(99).nullable().optional(),
    gender: z.array(z.enum(PublicsGender)).nullable().optional(),
    administrative: z
      .array(z.enum(PublicsAdministrative))
      .nullable()
      .optional(),
    familialle: z.array(z.enum(PublicsFamily)).nullable().optional(),
    other: z.array(z.enum(PublicsOther)).nullable().optional(),
  })
  .describe('Public audience filters.');

const updatedAtSchema = z.looseObject({
  intervalType: z.enum(UpdatedAtInterval).nullable().optional(),
  value: z.coerce.date().nullable().optional(),
});

const optionsSchema = z.looseObject({
  sortBy: z
    .enum([
      'createdAt',
      'lieu_id',
      'name',
      'distance',
      'slugs.infos.name',
      'status',
      'updatedAt',
    ])
    .nullable()
    .optional(),
  sortValue: z.coerce
    .number()
    .refine((value) => value === 1 || value === -1)
    .nullable()
    .optional(),
  page: z.coerce.number().int().nullable().optional(),
  limit: z.coerce.number().int().nullable().optional(),
  fields: z.string().min(1).nullable().optional(),
});

export const v20260101SearchRouteParamsSchema = z
  .looseObject({
    lang: z
      .string()
      .trim()
      .toLowerCase()
      .refine(
        (lang) =>
          SUPPORTED_LANGUAGES.includes(
            lang as (typeof SUPPORTED_LANGUAGES)[number],
          ),
        {
          message: 'lang must be one of the supported Soliguide languages',
        },
      )
      .nullable()
      .optional()
      .describe('Optional route parameter from POST /new-search/:lang?.'),
  })
  .describe('Route params schema for POST /new-search/:lang?.');

export const v20260101SearchRequestSchema = z
  .looseObject({
    location: locationSchema.describe(
      'Primary location constraint (required by route validation).',
    ),
    locations: z
      .array(locationSchema)
      .nullable()
      .optional()
      .describe(
        'Optional list of locations for widget-like multi-location search.',
      ),
    category: z.enum(Categories).nullable().optional(),
    categories: z
      .array(z.enum(Categories))
      .nullable()
      .optional()
      .describe(
        'Multiple categories (restricted by user status at route level).',
      ),
    placeType: z
      .enum(PlaceType)
      .default(PlaceType.PLACE)
      .describe('Resource type to search: fixed places or itineraries.'),
    word: z.string().nullable().optional(),
    openToday: z.coerce
      .boolean()
      .nullable()
      .optional()
      .describe('Only return results that are open today.')
      .meta({
        example: true,
      }),
    modalities: modalitiesSchema.nullable().optional(),
    publics: publicsSchema.nullable().optional(),
    languages: z
      .string()
      .refine((value) => PLACE_LANGUAGES_LIST_MAP_KEY.includes(value), {
        message: 'languages must be one of PLACE_LANGUAGES_LIST_MAP_KEY',
      })
      .nullable()
      .optional(),
    widgetId: z
      .string()
      .refine(
        (value) =>
          WIDGETS_AVAILABLE.includes(
            value as (typeof WIDGETS_AVAILABLE)[number],
          ),
        {
          message: 'widgetId must be one of WIDGETS_AVAILABLE',
        },
      )
      .nullable()
      .optional(),
    updatedAt: updatedAtSchema.nullable().optional(),
    options: optionsSchema.nullable().optional(),
  })
  .describe(
    'Exhaustive request body schema for POST /new-search/:lang? (non-admin route).',
  );

export const v20260101SearchRoutePayloadSchema = z
  .object({
    params: v20260101SearchRouteParamsSchema,
    body: v20260101SearchRequestSchema,
  })
  .describe(
    'Full route payload schema (params + body) for POST /new-search/:lang?.',
  );

export type V20260101SearchRequest = z.infer<
  typeof v20260101SearchRequestSchema
>;
export type V20260101SearchRouteParams = z.infer<
  typeof v20260101SearchRouteParamsSchema
>;
export type V20260101SearchRoutePayload = z.infer<
  typeof v20260101SearchRoutePayloadSchema
>;
