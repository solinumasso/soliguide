import z from 'zod';

export const locationSchema = z.object({
  address: z.string().describe('Street address of the place.').meta({
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
  city: z.string().describe('City name.').meta({
    example: 'Paris',
  }),
  country: z
    .string()
    .describe('Country code in ISO 3166-1 alpha-2 format.')
    .meta({
      example: 'FR',
    }),
  timeZone: z.string().describe('IANA timezone of the place.').meta({
    example: 'Europe/Paris',
  }),
  department: z.string().describe('Department name (legacy field).').meta({
    example: 'Paris',
  }),
  departmentCode: z.string().describe('Department code (legacy field).').meta({
    example: '75',
  }),
  region: z.string().describe('Region name.').meta({
    example: 'Ile-de-France',
  }),
  regionCode: z.string().describe('Region code.').meta({
    example: '11',
  }),
  location: z
    .object({
      type: z.literal('Point').describe('GeoJSON point geometry type.'),
      coordinates: z
        .tuple([z.number(), z.number()])
        .describe(
          'GeoJSON coordinates [longitude, latitude] in decimal degrees.',
        )
        .meta({
          example: [2.3522, 48.8566],
        }),
    })
    .describe('Legacy GeoJSON location object.'),
});

export type Location = z.infer<typeof locationSchema>;
