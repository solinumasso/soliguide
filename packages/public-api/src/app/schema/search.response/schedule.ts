import z from 'zod';

export const timeSlotSchema = z.object({
  startTime: z.iso.time(),
  endTime: z.iso.time(),
});

const openingStatusSchema = z
  .enum(['open', 'closed', 'unknown'])
  .describe('Opening status for a day or public holiday.')
  .meta({ example: 'open' });

export const weeklyScheduleDaySchema = z
  .object({
    dayOfWeek: z
      .enum([
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
      ])
      .describe('Days of the week.')
      .meta({ example: 'monday' }),
    status: openingStatusSchema,
    timeSlots: z
      .array(timeSlotSchema)
      .describe(
        'Opening time slots for this day. May be empty when status is closed or unknown.',
      ),
  })
  .describe('Opening information for one day of the week.');

export const publicOpenedHolidaySchema = z
  .object({
    label: z
      .string()
      .describe('Human-readable name of the public holiday.')
      .meta({ example: 'New Year' }),
    status: z
      .enum(['open', 'closed'])
      .describe('Opening status for this public holiday.')
      .meta({ example: 'closed' }),
    timeSlots: z
      .array(timeSlotSchema)
      .describe('Opening time slots for this holiday when applicable.'),
  })
  .describe('Specific opening rule for one public holiday.');

export const scheduleSchema = z
  .object({
    weeklySchedule: z
      .array(weeklyScheduleDaySchema)
      .describe('Weekly opening schedule.'),
    publicHolidays: z
      .object({
        status: z
          .enum(['open', 'closed', 'unknown', 'specific'])
          .describe(
            'Default public holiday behavior. Use "specific" when holiday-specific entries are provided.',
          )
          .meta({ example: 'specific' }),
        openedHolidays: z
          .array(publicOpenedHolidaySchema)
          .describe('Holiday-specific opening rules.'),
      })
      .describe('Public holiday opening information.'),
  })
  .describe('Schedule information for a place or service.');
