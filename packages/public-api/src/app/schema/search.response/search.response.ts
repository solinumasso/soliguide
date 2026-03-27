import z from 'zod';
import { contactSchema } from './contact';
import { accessSchema } from './access';
import { audienceSchema } from './audience';
import { locationSchema } from './location';
import { scheduleSchema } from './schedule';
import { serviceSchema } from './service';
import { temporaryInformationSchema } from './temporary-information';

const baseResourceSchema = z
  .object({
    id: z.string().describe('Unique identifier of the place.').meta({
      example: 'place_12345',
    }),
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
    slug: z.string().describe('SEO-friendly unique slug for the place.').meta({
      example: 'community-support-center-paris',
    }),
    languages: z
      .array(z.string())
      .describe('Languages spoken at the place. Format ISO 639-3')
      .meta({ example: ['en', 'fr', 'rcf'] }),
    contact: z
      .array(contactSchema)
      .describe('Contact methods available for the place.'),
    access: accessSchema,
    audience: audienceSchema,
    temporaryInformation: temporaryInformationSchema.describe(
      'Temporary changes affecting the place.',
    ),
    services: z.array(serviceSchema),
    isOpenToday: z
      .boolean()
      .describe('Whether the place is open today.')
      .meta({ example: true }),
    updatedAt: z.iso
      .datetime()
      .describe('Last update date and time of this place in ISO 8601 format.')
      .meta({ example: '2026-03-26T10:15:00Z' }),
  })
  .describe('Place or itinerary returned by the API.');

const itineraryStopSchema = z.object({
  description: z
    .string()
    .nullable()
    .describe('Additional information about this stop or route point.'),
  location: locationSchema.describe(
    'Location where the itinerary service is available for this stop.',
  ),
  schedule: scheduleSchema.describe(
    'Schedule during which the itinerary service is available at this stop.',
  ),
});

const itinerarySchema = baseResourceSchema
  .extend({
    type: z
      .literal('itinerary')
      .describe(
        'Mobile or route-based service delivered across multiple locations according to a schedule.',
      ),
    stops: z
      .array(itineraryStopSchema)
      .describe(
        'Scheduled stops or route points where the itinerary service is available.',
      ),
  })
  .meta({ title: 'Itinerary' });

const fixedLocationSchema = baseResourceSchema
  .extend({
    type: z
      .literal('fixedLocation')
      .describe('Service delivered at a stable physical location.'),
    location: locationSchema.describe('Main location of the resource.'),
    schedule: scheduleSchema.describe('Main schedule of the resource.'),
  })
  .meta({ title: 'Fixed location' });

export const placeSchema = z
  .discriminatedUnion('type', [fixedLocationSchema, itinerarySchema])
  .meta({
    discriminator: {
      propertyName: 'type',
    },
  });

export const searchResponseSchema = z
  .object({
    _links: z
      .object({
        self: z
          .object({ href: z.string() })
          .strict()
          .describe('Link to the current page of results.')
          .meta({
            example: { href: '/search?page=1&limit=20' },
          }),
        next: z
          .object({ href: z.string() })
          .strict()
          .nullable()
          .describe('Link to the next page of results, if available.')
          .meta({
            example: { href: '/search?page=2&limit=20' },
          }),
        prev: z
          .object({ href: z.string() })
          .strict()
          .nullable()
          .describe('Link to the previous page of results, if available.')
          .meta({
            example: null,
          }),
      })
      .strict()
      .describe('Navigation links.'),
    results: z
      .array(placeSchema)
      .describe(
        'List of resources matching the search criteria. Each item can be either a fixed location or an itinerary depending on its "type".',
      ),
    page: z
      .object({
        current: z
          .number()
          .int()
          .min(1)
          .describe('Current page number (1-based index).')
          .meta({ example: 1 }),
        limit: z
          .number()
          .int()
          .min(1)
          .describe('Number of results per page.')
          .meta({ example: 20 }),
        totalPages: z
          .number()
          .int()
          .min(1)
          .describe('Total number of pages available.')
          .meta({ example: 5 }),
        totalResults: z
          .number()
          .int()
          .min(0)
          .describe('Total number of results matching the search criteria.')
          .meta({ example: 87 }),
      })
      .strict()
      .describe('Pagination metadata.'),
  })
  .strict()
  .describe(
    'Search response containing paginated results and navigation links.',
  );
