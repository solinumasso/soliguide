import z from 'zod';
import { scheduleSchema } from './schedule';

const temporaryClosureSchema = z.object({
  startDate: z.iso
    .datetime()
    .describe(
      'Start date and time of the temporary closure in ISO 8601 format.',
    )
    .meta({
      example: '2026-04-01T00:00:00Z',
    }),
  endDate: z.iso
    .datetime()
    .describe('End date and time of the temporary closure in ISO 8601 format.')
    .meta({
      example: '2026-04-03T23:59:59Z',
    }),
  description: z
    .string()
    .describe('Explanation of the temporary closure.')
    .meta({
      example: 'Renovation work.',
    }),
});

const temporaryScheduleAdjustmentSchema = z.object({
  startDate: z.iso
    .datetime()
    .describe(
      'Start date and time of the temporary schedule adjustment in ISO 8601 format.',
    ),
  endDate: z.iso
    .datetime()
    .describe(
      'End date and time of the temporary schedule adjustment in ISO 8601 format.',
    ),
  description: z
    .string()
    .describe('Explanation of the temporary schedule adjustment.')
    .meta({
      example: 'Reduced opening hours during school holidays.',
    }),
  schedule: scheduleSchema.describe(
    'Schedule applied during the temporary adjustment period.',
  ),
});

const temporaryMessageSchema = z.object({
  title: z.string().describe('Short title of the temporary message.').meta({
    example: 'Important notice',
  }),
  startDate: z.iso
    .datetime()
    .describe(
      'Start date and time from which the message is active in ISO 8601 format.',
    ),
  endDate: z.iso
    .datetime()
    .describe(
      'End date and time until which the message is active in ISO 8601 format.',
    ),
  description: z.string().describe('Message content.').meta({
    example: 'Bring an ID document on your first visit.',
  }),
});

export const temporaryInformationSchema = z
  .object({
    closures: z
      .array(temporaryClosureSchema)
      .describe('List of temporary closures affecting the place.'),
    scheduleAdjustments: z
      .array(temporaryScheduleAdjustmentSchema)
      .describe('List of temporary schedule changes affecting the place.'),
    messages: z
      .array(temporaryMessageSchema)
      .describe(
        'List of temporary informational messages displayed for the place.',
      ),
  })
  .describe(
    'Temporary operational and informational changes affecting the place.',
  );

export type TemporaryInformation = z.infer<typeof temporaryInformationSchema>;
