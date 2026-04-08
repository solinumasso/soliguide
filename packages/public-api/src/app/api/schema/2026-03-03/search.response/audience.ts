import z from 'zod';

export const specialSupportContextSchema = z
  .object({
    type: z.string().describe('Broad category of support context.').meta({
      example: 'humanitarianCrisis',
    }),
    key: z
      .string()
      .describe('Stable machine-readable identifier for the support context.')
      .meta({
        example: 'ukraine-displacement',
      }),
    label: z
      .string()
      .describe('Human-readable label for the support context.')
      .meta({
        example: 'Support for displaced people from Ukraine',
      }),
    details: z
      .string()
      .describe(
        'Additional details about the support available in this context.',
      )
      .meta({
        example: 'Ukrainian-speaking volunteers available.',
      }),
  })
  .describe(
    'Special support context related to a crisis or exceptional situation.',
  );

export const audienceSchema = z
  .object({
    admissionPolicy: z
      .enum(['open', 'restricted'])
      .describe(
        'Whether the place or service is open to everyone or restricted to specific audiences.',
      )
      .meta({ example: 'open' }),
    isTargeted: z
      .boolean()
      .describe(
        'Whether the place or service is designed for certain audiences, even if broad admission is open.',
      )
      .meta({ example: true }),
    description: z
      .string()
      .describe('Free-text description of the intended or accepted audience.')
      .meta({ example: 'Young adults in unstable housing.' }),
    ageRange: z
      .object({
        min: z
          .int()
          .nonnegative()
          .describe('Minimum age accepted.')
          .meta({ example: 18 }),
        max: z
          .int()
          .nonnegative()
          .describe('Maximum age accepted.')
          .meta({ example: 30 }),
      })
      .nullable()
      .describe('Age restriction. Null means there is no age restriction.')
      .meta({ example: { min: 18, max: 30 } }),
    administrativeStatuses: z
      .enum(['regular', 'asylum', 'refugee', 'undocumented'])
      .describe(
        'Accepted or targeted administrative statuses.\n- regular: Person in regular situation. \n- asylum: Person in asylum. \n- refugee: Person with refugee status. \n- undocumente: Person without passport or ID.',
      ),
    familyStatuses: z
      .enum(['isolated', 'family', 'couple', 'pregnant'])
      .describe(
        'Accepted or targeted family situations.\n- isolated: Isolated person.\n- family: Family.\n- couple: Couple.\n- pregnant: Pregnant Woman.',
      ),
    otherStatuses: z
      .enum([
        'violence',
        'addiction',
        'disability',
        'lgbt+',
        'hiv',
        'prostitution',
        'prison',
        'student',
      ])
      .describe(
        'Other accepted or targeted statuses.\n- violence: Person victim of violence.\n- addiction: Person suffering from addition.\n- disability: Person with disabilities.\n- lgbt+: Person among LGBT+ communities.\n- hiv: Person suffering from HIV.\n- prostitution: Person suffering from prostitution.\n- prison: Person getting out of prison.\n- student: Student.',
      ),
    genders: z
      .enum(['men', 'women'])
      .describe('Accepted or targeted genders.\n- men: Men.\n- women: Women'),
    specialSupportContexts: z
      .array(specialSupportContextSchema)
      .describe('Special support contexts such as crisis-specific support.'),
  })
  .describe('Audience rules and targeting information.');

export type Audience = z.infer<typeof audienceSchema>;
