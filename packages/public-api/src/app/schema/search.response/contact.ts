import z from 'zod';

const emailContactSchema = z
  .object({
    type: z.literal('email').describe('Contact method type.'),
    label: z.string().describe('Display label for this contact method.').meta({
      example: 'Main email',
    }),
    value: z.email().describe('Email address.').meta({
      example: 'contact@example.org',
    }),
  })
  .meta({ title: 'Email contact' });

const phoneContactSchema = z
  .object({
    type: z.literal('phone').describe('Contact method type.'),
    label: z.string().describe('Display label for this contact method.').meta({
      example: 'Reception',
    }),
    value: z.string().describe('Phone number.').meta({
      example: '+33102030405',
    }),
  })
  .meta({ title: 'Phone contact' });

const faxContactSchema = z
  .object({
    type: z.literal('fax').describe('Contact method type.'),
    label: z.string().describe('Display label for this contact method.').meta({
      example: 'Fax',
    }),
    value: z.string().describe('Fax number.').meta({
      example: '+33102030406',
    }),
  })
  .meta({ title: 'Fax contact' });

const websiteContactSchema = z
  .object({
    type: z.literal('website').describe('Contact method type.'),
    label: z.string().describe('Display label for this contact method.').meta({
      example: 'Official website',
    }),
    value: z.url().describe('Website URL.').meta({
      example: 'https://example.org',
    }),
  })
  .meta({ title: 'Website contact' });

const socialContactSchema = z
  .object({
    type: z.literal('social').describe('Contact method type.'),
    platform: z
      .string()
      .describe('Social media platform name. Only present for social contacts.')
      .meta({
        example: 'facebook',
      }),
    label: z.string().describe('Display label for this contact method.').meta({
      example: 'Facebook page',
    }),
    value: z.url().describe('Social media profile or page URL.').meta({
      example: 'https://facebook.com/example',
    }),
  })
  .meta({ title: 'Social contact' });

/**
 * Adding, updating or removing a contact
 * is not important enough to require a new API version.
 * We should be able to add new contact without modifying the API contract
 */

export const contactSchema = z
  .discriminatedUnion('type', [
    emailContactSchema,
    phoneContactSchema,
    faxContactSchema,
    websiteContactSchema,
    socialContactSchema,
  ])
  .describe('A contact method for the place or service.')
  .meta({
    discriminator: {
      propertyName: 'type',
    },
  });
