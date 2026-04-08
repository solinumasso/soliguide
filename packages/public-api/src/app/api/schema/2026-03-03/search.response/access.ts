import z from 'zod';

const requirementSchema = z.object({
  isRequired: z.boolean().describe('Whether an this requirement applies.'),
  details: z.string().nullable().describe('Additional details about'),
});

/**
 * Adding, modifying removing any information for access is a critical information
 * and client must know it happened.
 * This warrant usage of an KeyValue object instead of an array.
 */
export const accessSchema = z
  .object({
    isUnconditional: z
      .boolean()
      .describe(
        'If true, access to the facility is unconditional and there are no requirements',
      ),
    allowPets: z.boolean().describe('Whether pets are allowed.'),
    isWheelchairAccessible: z
      .boolean()
      .describe('Whether the place is accessible to wheelchair'),

    appointmentRequirement: requirementSchema.describe(
      'Appointement requirement.',
    ),
    registrationRequirement: requirementSchema.describe(
      'Registration requirement.',
    ),
    orientationRequirement: requirementSchema.describe(
      'Orientation requirement.',
    ),
    pricing: z.object({
      isPaid: z
        .boolean()
        .describe('Whether the place or service requires payment.')
        .meta({
          example: false,
        }),
      details: z
        .string()
        .nullable()
        .describe('Additional pricing details.')
        .meta({
          example: '2€ per meal',
        }),
    }),
    otherDetails: z
      .string()
      .nullable()
      .describe(
        'Additional free-text information related to access conditions.',
      )
      .meta({
        example: 'Bring an ID document on your first visit.',
      }),
  })
  .describe('Access rules applying to the place.');

export type Access = z.infer<typeof accessSchema>;
