import z from 'zod';

const administrativeDivisionSchema = z.object({
  type: z
    .string()
    .describe('Type of administrative division in the local country context.')
    .meta({
      example: 'department',
    }),
  code: z
    .string()
    .describe('Administrative code for this division, when available.')
    .meta({
      example: '75',
    }),
  name: z
    .string()
    .describe('Human-readable name of the administrative division.')
    .meta({
      example: 'Paris',
    }),
});

/**
 * Region, Department and City are a bit too related to France.
 * Other countries, such as Spain, do not have the same division.
 * Using administrativeDivisions here allows to pass those information while being relevant to the country
 */
export const locationSchema = z.object({
  address: z
    .object({
      streetAddress: z.string().describe('Street address of the place.').meta({
        example: '10 rue Example',
      }),
      additionalInformation: z
        .string()
        .describe(
          'Additional address details such as building, floor, or entrance.',
        )
        .meta({
          example: 'Building B, 2nd floor',
        }),
      postalCode: z.string().describe('Postal code.').meta({
        example: '75010',
      }),
      locality: z.string().describe('Locality or city name.').meta({
        example: 'Paris',
      }),
      countryCode: z
        .string()
        .describe('Country code in ISO 3166-1 alpha-2 format.')
        .meta({
          example: 'FR',
        }),
      timeZone: z.string().describe('IANA timezone of the place.').meta({
        example: 'Europe/Paris',
      }),
    })
    .describe('Postal address of the place.'),
  administrativeDivisions: z
    .array(administrativeDivisionSchema)
    .describe(
      'Country-specific administrative divisions associated with the place.',
    ),
  coordinates: z
    .object({
      latitude: z.number().describe('Latitude in decimal degrees.').meta({
        example: 48.8566,
      }),
      longitude: z.number().describe('Longitude in decimal degrees.').meta({
        example: 2.3522,
      }),
    })
    .describe('Geographic coordinates of the place.'),
});
