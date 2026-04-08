import {
  Categories,
  GeoTypes,
  PlaceClosedHolidays,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  ServiceSaturation,
} from '@soliguide/common';
import { z } from 'zod';

const legacyDateSchema = z.union([z.date(), z.string()]);

const legacyPositionSchema = z
  .object({
    location: z
      .object({
        type: z.literal('Point').optional(),
        coordinates: z.array(z.number()).optional(),
      })
      .strict()
      .optional(),
    address: z.string().optional(),
    additionalInformation: z.string().optional(),
    city: z.string().optional(),
    cityCode: z.string().optional(),
    postalCode: z.string().optional(),
    department: z.string().optional(),
    departmentCode: z.string().optional(),
    region: z.string().optional(),
    regionCode: z.string().optional(),
    country: z.string().optional(),
    timeZone: z.string().optional(),
    adresse: z.string().optional(),
    codePostal: z.string().optional(),
    complementAdresse: z.string().optional(),
    departement: z.string().optional(),
    pays: z.string().optional(),
    ville: z.string().optional(),
  })
  .strict();

const legacyPhotoSchema = z
  .object({
    _id: z.string().optional(),
    encoding: z.string().optional(),
    filename: z.string(),
    mimetype: z.string(),
    parcours_id: z.number().int().optional(),
    path: z.string(),
    lieu_id: z.number().int(),
    size: z.number().optional(),
    createdAt: legacyDateSchema.optional(),
    updatedAt: legacyDateSchema.optional(),
  })
  .strict();

const legacyTimeslotSchema = z
  .object({
    end: z.number().nullable().optional(),
    start: z.number().nullable().optional(),
  })
  .strict();

const legacyDayOpeningHoursSchema = z
  .object({
    open: z.boolean().optional(),
    timeslot: z.array(legacyTimeslotSchema).optional(),
  })
  .strict();

const legacyOpeningHoursSchema = z
  .object({
    closedHolidays: z.enum(PlaceClosedHolidays).optional(),
    description: z.string().nullable().optional(),
    monday: legacyDayOpeningHoursSchema.optional(),
    tuesday: legacyDayOpeningHoursSchema.optional(),
    wednesday: legacyDayOpeningHoursSchema.optional(),
    thursday: legacyDayOpeningHoursSchema.optional(),
    friday: legacyDayOpeningHoursSchema.optional(),
    saturday: legacyDayOpeningHoursSchema.optional(),
    sunday: legacyDayOpeningHoursSchema.optional(),
  })
  .strict();

const legacyModalitiesCheckSchema = z
  .object({
    checked: z.boolean().optional(),
    precisions: z.string().nullable().optional(),
  })
  .strict();

const legacyModalitiesSchema = z
  .object({
    inconditionnel: z.boolean().optional(),
    appointment: legacyModalitiesCheckSchema.optional(),
    inscription: legacyModalitiesCheckSchema.optional(),
    orientation: legacyModalitiesCheckSchema.optional(),
    price: legacyModalitiesCheckSchema.optional(),
    animal: z
      .object({
        checked: z.boolean().optional(),
      })
      .strict()
      .optional(),
    pmr: z
      .object({
        checked: z.boolean().optional(),
      })
      .strict()
      .optional(),
    docs: z.array(z.string()).optional(),
    other: z.string().nullable().optional(),
  })
  .strict();

export type LegacyModalities = z.infer<typeof legacyModalitiesSchema>;

const legacyPublicsSchema = z
  .object({
    accueil: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
    administrative: z.array(z.string()).optional(),
    age: z
      .object({
        max: z.number().optional(),
        min: z.number().optional(),
      })
      .strict()
      .optional(),
    description: z.string().nullable().optional(),
    familialle: z.array(z.string()).optional(),
    gender: z.array(z.string()).optional(),
    other: z.array(z.string()).optional(),
  })
  .strict();

const legacyCategorySpecificFieldsSchema = z
  .object({
    activityName: z.string().optional(),
    availableEquipmentPrecisions: z.string().optional(),
    availableEquipmentType: z.array(z.string()).optional(),
    babyParcelAgeType: z.array(z.string()).optional(),
    canteensMealType: z.string().optional(),
    courseType: z.string().optional(),
    degreeOfChoiceType: z.string().optional(),
    dietaryAdaptationsType: z.array(z.string()).optional(),
    dietaryRegimesType: z.string().optional(),
    domiciliationType: z.string().optional(),
    foodProductType: z.array(z.string()).optional(),
    otherProductTypePrecisions: z.string().optional(),
    hygieneProductType: z.string().optional(),
    jobsList: z.string().optional(),
    nationalOriginProductType: z.string().optional(),
    organicOriginProductType: z.string().optional(),
    serviceStyleType: z.array(z.string()).optional(),
    usageModality: z.string().optional(),
    voucherType: z.string().optional(),
    voucherTypePrecisions: z.string().optional(),
    wellnessActivityName: z.string().optional(),
  })
  .strict();

const legacyServiceSchema = z
  .object({
    categorie: z.number().int().optional(),
    category: z.enum(Categories),
    close: z
      .object({
        actif: z.boolean().optional(),
        dateDebut: legacyDateSchema.nullable().optional(),
        dateFin: legacyDateSchema.nullable().optional(),
      })
      .strict()
      .optional(),
    description: z.string().nullable().optional(),
    differentHours: z.boolean().optional(),
    differentModalities: z.boolean().optional(),
    differentPublics: z.boolean().optional(),
    hours: legacyOpeningHoursSchema.optional(),
    isOpenToday: z.boolean(),
    modalities: legacyModalitiesSchema.optional(),
    publics: legacyPublicsSchema.optional(),
    saturated: z
      .object({
        precision: z.string().nullable().optional(),
        status: z.enum(ServiceSaturation).optional(),
      })
      .strict()
      .optional(),
    serviceObjectId: z.string(),
    createdAt: legacyDateSchema,
    categorySpecificFields: legacyCategorySpecificFieldsSchema.optional(),
    jobsList: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
  })
  .strict();

export type LegacyService = z.infer<typeof legacyServiceSchema>;

const legacyGeoZoneSchema = z
  .object({
    geoType: z.enum(GeoTypes).nullable().optional(),
    geoValue: z.string().optional(),
    label: z.string().optional(),
  })
  .strict();

const legacyTempInfoBaseSchema = z
  .object({
    actif: z.boolean().optional(),
    dateDebut: legacyDateSchema.nullable().optional(),
    dateFin: legacyDateSchema.nullable().optional(),
    description: z.string().optional(),
  })
  .strict();

const legacyTempInfoSchema = z
  .object({
    closure: legacyTempInfoBaseSchema.optional(),
    hours: legacyTempInfoBaseSchema
      .extend({
        hours: legacyOpeningHoursSchema.nullable().optional(),
      })
      .strict()
      .optional(),
    message: legacyTempInfoBaseSchema
      .extend({
        name: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type LegacyTempInfos = z.infer<typeof legacyTempInfoSchema>;

const legacySourceSchema = z
  .object({
    ids: z
      .array(
        z
          .object({
            id: z.string(),
            url: z.string().optional(),
          })
          .strict(),
      )
      .optional(),
    isOrigin: z.boolean(),
    license: z.string().optional(),
    name: z.string(),
  })
  .strict();

const legacyParcoursSchema = z
  .object({
    description: z.string().nullable().optional(),
    hours: legacyOpeningHoursSchema.optional(),
    position: legacyPositionSchema.nullable().optional(),
    photos: z.array(legacyPhotoSchema).optional(),
    show: z.boolean().optional(),
  })
  .strict();

const legacyPhoneSchema = z
  .object({
    label: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    countryCode: z.string().optional(),
    isSpecialPhoneNumber: z.boolean().optional(),
  })
  .strict();

const legacyEntitySchema = z
  .object({
    facebook: z.string().optional(),
    fax: z.string().optional(),
    instagram: z.string().optional(),
    mail: z.string().optional(),
    name: z.string().nullable().optional(),
    phones: z.array(legacyPhoneSchema).optional(),
    website: z.string().nullable().optional(),
  })
  .strict();

const legacySlugsSchema = z
  .object({
    infos: z
      .object({
        description: z.string().nullable().optional(),
        name: z.string().nullable().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const v20260101SearchPlaceResponseSchema = z
  .object({
    lieu_id: z.number().int().describe('Numeric place identifier.'),
    _id: z.string().optional(),
    seo_url: z.string().optional(),
    auto: z.boolean().optional(),
    name: z.string().describe('Localized name of the place.').meta({
      example: 'Community Support Center',
    }),
    description: z
      .string()
      .describe('Localized HTML content describing the place.')
      .meta({
        example:
          '<p>A support center providing food distribution and social services.</p>',
      }),
    status: z.enum(PlaceStatus).optional(),
    visibility: z.enum(PlaceVisibility).optional(),
    isOpenToday: z
      .boolean()
      .describe('Whether the place is open today.')
      .meta({ example: true }),
    close: z.boolean().optional(),
    photos: z.array(legacyPhotoSchema).optional(),
    placeType: z.enum(PlaceType).optional(),
    services_all: z.array(legacyServiceSchema).optional(),
    position: legacyPositionSchema.optional(),
    parcours: z.array(legacyParcoursSchema).optional(),
    entity: legacyEntitySchema.optional(),
    geoZones: z.array(legacyGeoZoneSchema).optional(),
    newhours: legacyOpeningHoursSchema.optional(),
    modalities: legacyModalitiesSchema.optional(),
    publics: legacyPublicsSchema.optional(),
    sourceLanguage: z.string().optional(),
    country: z.string().optional(),
    languages: z
      .array(z.string())
      .describe('Languages spoken at the place. Format ISO 639-3')
      .meta({ example: ['en', 'fr', 'rcf'] }),
    createdAt: legacyDateSchema.optional(),
    updatedAt: legacyDateSchema.optional(),
    updatedByUserAt: legacyDateSchema.optional(),
    tempInfos: legacyTempInfoSchema.optional(),
    sources: z.array(legacySourceSchema).optional(),
    slugs: legacySlugsSchema.optional(),
    distance: z.number().optional(),
  })
  .strict()
  .describe(
    'Legacy place payload returned by POST /new-search/:lang? with admin-oriented fields removed (organizations, campaigns, createdBy, priority, stepsDone).',
  );

export const v20260101SearchResponseSchema = z
  .object({
    nbResults: z
      .number()
      .int()
      .min(0)
      .describe('Total number of matching places.'),
    places: z
      .array(v20260101SearchPlaceResponseSchema)
      .describe('List of matching place payloads.'),
  })
  .strict()
  .describe(
    'Legacy response payload for POST /new-search/:lang? excluding admin-oriented fields.',
  );

export type V20260101SearchPlaceResponse = z.infer<
  typeof v20260101SearchPlaceResponseSchema
>;
export type V20260101SearchResponse = z.infer<
  typeof v20260101SearchResponseSchema
>;
