import { z } from 'zod';
import { categories } from '../search.response/category';

const localDateSchema = z
  .string()
  .describe('Date in ISO 8601 calendar format (YYYY-MM-DD).')
  .meta({
    example: '2026-03-26',
    format: 'date',
  });

const accessModeEnum = z
  .enum(['appointment', 'registration', 'orientation'])
  .describe('Access mode required before receiving the service.')
  .meta({
    example: 'appointment',
  });

const administrativeStatusEnum = z.enum([
  'regular',
  'asylum',
  'refugee',
  'undocumented',
]);

const familySituationEnum = z.enum([
  'isolated',
  'family',
  'couple',
  'pregnant',
]);

const genderEnum = z.enum(['men', 'women']);

const audienceCharacteristicEnum = z.enum([
  'violence',
  'addiction',
  'disability',
  'lgbtqPlus',
  'hiv',
  'sexWork',
  'prison',
  'student',
]);

export const searchRequestSchema = z
  .object({
    q: z
      .string()
      .min(1)
      .optional()
      .describe('Free-text query applied to searchable content.')
      .meta({
        example: 'family shelter',
      }),

    language: z
      .string()
      .min(2)
      .optional()
      .describe(
        'Language in which the content should be returned. Format ISO 639-3.',
      )
      .meta({
        example: 'fr',
      }),

    categories: z
      .array(z.enum(categories))
      .optional()
      .describe(
        'Category identifiers to include in the search. Each provided category automatically includes its descendant categories.',
      )
      .meta({ example: ['food', 'health'] }),

    locationMode: z
      .enum(['country', 'administrativeDivision', 'locality', 'pointRadius'])
      .describe('Geographic search mode.')
      .meta({
        example: 'pointRadius',
      }),

    country: z
      .string()
      .length(2)
      .optional()
      .describe(
        'Country code in ISO 3166-1 alpha-2 country code format.\nUsed by country, administrative-division, and locality searches, and optional for point-radius searches.',
      )
      .meta({
        example: 'FR',
      }),

    divisionType: z
      .string()
      .optional()
      .describe('Type of administrative division in the local country context.')
      .meta({
        example: 'department',
      }),

    divisionCode: z
      .string()
      .optional()
      .describe('Administrative code for the division, when available.')
      .meta({
        example: '75',
      }),

    divisionName: z
      .string()
      .optional()
      .describe(
        'Human-readable name of the administrative division, when available.',
      )
      .meta({
        example: 'Paris',
      }),

    localityType: z
      .enum(['city', 'postalCode'])
      .optional()
      .describe('Type of locality identifier. Used for locality search.')
      .meta({
        example: 'city',
      }),

    localityValue: z
      .string()
      .optional()
      .describe('Value of the locality identifier.')
      .meta({
        example: 'Madrid',
      }),

    latitude: z.coerce
      .number()
      .min(-90)
      .max(90)
      .optional()
      .describe('Latitude in decimal degrees for point-radius search.')
      .meta({
        example: 48.8566,
      }),

    longitude: z.coerce
      .number()
      .min(-180)
      .max(180)
      .optional()
      .describe('Longitude in decimal degrees for point-radius search.')
      .meta({
        example: 2.3522,
      }),

    radiusKm: z.coerce
      .number()
      .positive()
      .optional()
      .describe('Search radius in kilometers for point-radius search.')
      .meta({
        example: 10,
      }),

    openToday: z
      .boolean()
      .optional()
      .describe('Only return results that are open today.')
      .meta({
        example: true,
      }),

    accessKind: z
      .enum(['unconditional', 'conditional'])
      .optional()
      .describe('Whether to search for unconditional or conditional access.')
      .meta({
        example: 'conditional',
      }),

    accessModes: z
      .union([accessModeEnum, z.array(accessModeEnum)])
      .transform((value) => (Array.isArray(value) ? value : [value]))
      .optional()
      .describe(
        'Access modes required when accessKind is conditional. Repeat the parameter to provide multiple values.',
      )
      .meta({
        example: ['appointment', 'orientation'],
      }),

    audienceAdmissionPolicy: z
      .enum(['open', 'restricted'])
      .optional()
      .describe(
        'Whether the service is open to everyone or restricted to specific audiences.',
      )
      .meta({
        example: 'restricted',
      }),

    audienceIsTargeted: z
      .boolean()
      .optional()
      .describe(
        'Whether the service is specifically targeted to certain audiences.',
      )
      .meta({
        example: true,
      }),

    audienceAdministrativeStatuses: z
      .union([administrativeStatusEnum, z.array(administrativeStatusEnum)])
      .transform((value) => (Array.isArray(value) ? value : [value]))
      .optional()
      .describe(
        'Administrative statuses accepted or targeted by the service. Repeat the parameter to provide multiple values.',
      )
      .meta({
        example: ['refugee', 'asylum'],
      }),

    audienceMinAge: z.coerce
      .number()
      .int()
      .min(0)
      .optional()
      .describe('Minimum supported age.')
      .meta({
        example: 18,
      }),

    audienceMaxAge: z.coerce
      .number()
      .int()
      .min(0)
      .optional()
      .describe('Maximum supported age.')
      .meta({
        example: 25,
      }),

    audienceFamilySituations: z
      .union([familySituationEnum, z.array(familySituationEnum)])
      .transform((value) => (Array.isArray(value) ? value : [value]))
      .optional()
      .describe(
        'Family situations accepted or targeted by the service. Repeat the parameter to provide multiple values.',
      )
      .meta({
        example: ['family', 'pregnant'],
      }),

    audienceGenders: z
      .union([genderEnum, z.array(genderEnum)])
      .transform((value) => (Array.isArray(value) ? value : [value]))
      .optional()
      .describe(
        'Gender audiences accepted or targeted by the service. Repeat the parameter to provide multiple values.',
      )
      .meta({
        example: ['women'],
      }),

    audienceOtherCharacteristics: z
      .union([audienceCharacteristicEnum, z.array(audienceCharacteristicEnum)])
      .transform((value) => (Array.isArray(value) ? value : [value]))
      .optional()
      .describe(
        'Additional audience characteristics accepted or targeted by the service. Repeat the parameter to provide multiple values.',
      )
      .meta({
        example: ['disability', 'student'],
      }),

    updatedOn: localDateSchema
      .optional()
      .describe('Only return results updated on this date.'),

    updatedBefore: localDateSchema
      .optional()
      .describe('Only return results updated before this date.'),

    updatedAfter: localDateSchema
      .optional()
      .describe('Only return results updated after this date.'),

    page: z.coerce
      .number()
      .int()
      .min(1)
      .optional()
      .describe('Page number, starting at 1.')
      .meta({
        example: 1,
      }),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe('Maximum number of results returned per page.')
      .meta({
        example: 20,
      }),
  })
  .superRefine((value, ctx) => {
    if (value.updatedOn && (value.updatedBefore || value.updatedAfter)) {
      ctx.addIssue({
        code: 'custom',
        path: ['updatedOn'],
        message:
          'updatedOn cannot be combined with updatedBefore or updatedAfter.',
      });
    }

    if (
      value.audienceMinAge !== undefined &&
      value.audienceMaxAge !== undefined &&
      value.audienceMinAge > value.audienceMaxAge
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['audienceMinAge'],
        message: 'audienceMinAge cannot be greater than audienceMaxAge.',
      });
    }

    if (value.accessKind === 'unconditional' && value.accessModes?.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['accessModes'],
        message:
          'accessModes cannot be provided when accessKind is unconditional.',
      });
    }

    if (value.accessKind === 'conditional' && !value.accessModes?.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['accessModes'],
        message: 'accessModes must be provided when accessKind is conditional.',
      });
    }

    switch (value.locationMode) {
      case 'country':
        if (!value.country) {
          ctx.addIssue({
            code: 'custom',
            path: ['country'],
            message: 'country is required when locationMode is country.',
          });
        }
        break;

      case 'administrativeDivision':
        if (!value.country) {
          ctx.addIssue({
            code: 'custom',
            path: ['country'],
            message:
              'country is required when locationMode is administrativeDivision.',
          });
        }
        if (!value.divisionType) {
          ctx.addIssue({
            code: 'custom',
            path: ['divisionType'],
            message:
              'divisionType is required when locationMode is administrativeDivision.',
          });
        }
        if (!value.divisionCode && !value.divisionName) {
          ctx.addIssue({
            code: 'custom',
            path: ['divisionCode'],
            message:
              'Either divisionCode or divisionName must be provided when locationMode is administrativeDivision.',
          });
        }
        break;

      case 'locality':
        if (!value.localityType) {
          ctx.addIssue({
            code: 'custom',
            path: ['localityType'],
            message: 'localityType is required when locationMode is locality.',
          });
        }
        if (!value.localityValue) {
          ctx.addIssue({
            code: 'custom',
            path: ['localityValue'],
            message: 'localityValue is required when locationMode is locality.',
          });
        }
        break;

      case 'pointRadius':
        if (value.latitude === undefined) {
          ctx.addIssue({
            code: 'custom',
            path: ['latitude'],
            message: 'latitude is required when locationMode is pointRadius.',
          });
        }
        if (value.longitude === undefined) {
          ctx.addIssue({
            code: 'custom',
            path: ['longitude'],
            message: 'longitude is required when locationMode is pointRadius.',
          });
        }
        if (value.radiusKm === undefined) {
          ctx.addIssue({
            code: 'custom',
            path: ['radiusKm'],
            message: 'radiusKm is required when locationMode is pointRadius.',
          });
        }
        break;
    }
  })
  .describe('Query parameters for the search endpoint.');
