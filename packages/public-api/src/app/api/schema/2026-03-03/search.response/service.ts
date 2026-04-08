import z from 'zod';
import { categories, categoryOpenApiDescription } from './category';
import { accessSchema } from './access';
import { audienceSchema } from './audience';
import { scheduleSchema } from './schedule';

export const serviceSchema = z
  .object({
    id: z.string().describe('Unique service identifier.').meta({
      example: 'service_1',
    }),
    category: z.enum(categories).describe(categoryOpenApiDescription).meta({
      example: 'food_distribution',
    }),
    description: z.string().describe('Description of the service.').meta({
      example: 'Breakfast and hot drinks.',
    }),
    saturation: z
      .object({
        level: z
          .enum(['low', 'moderate', 'high'])
          .describe('Saturation level of the service.')
          .meta({ example: 'high' }),
        details: z
          .string()
          .nullable()
          .describe('Additional details about service saturation.')
          .meta({ example: 'Very busy on Mondays.' }),
      })
      .describe('Saturation information for the service.'),
    isOpenToday: z
      .boolean()
      .describe('Whether the service is open today')
      .meta({ example: true }),
    access: accessSchema
      .nullable()
      .describe(
        'Service-specific access rules. Null means the service inherits access rules from the place.',
      ),
    audience: audienceSchema
      .nullable()
      .describe(
        'Service-specific audience rules. Null means the service inherits audience rules from the place.',
      ),
    schedule: scheduleSchema
      .nullable()
      .describe(
        'Service-specific schedule. Null means the service inherits schedule from the place.',
      ),
  })
  .describe('Service provided by the place.');

export type Service = z.infer<typeof serviceSchema>;
