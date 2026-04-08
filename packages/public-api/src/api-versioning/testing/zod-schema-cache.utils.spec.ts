import { z } from 'zod';
import { applySchemaPatch } from './zod-schema-cache.utils';

describe('applySchemaPatch', () => {
  it('replaces the schema at root payload path', () => {
    const sourceSchema = z
      .object({
        legacy: z.string(),
      })
      .strict();

    const patchedSchema = applySchemaPatch(sourceSchema, {
      payloadPath: '/',
      replace: {
        zod: z
          .object({
            current: z.number(),
          })
          .strict(),
      },
    });

    expect(patchedSchema.safeParse({ current: 42 }).success).toBe(true);
    expect(patchedSchema.safeParse({ legacy: 'x' }).success).toBe(false);
  });

  it('replaces schema at array wildcard payload path', () => {
    const sourceSchema = z
      .object({
        results: z.array(
          z
            .object({
              slug: z.string(),
            })
            .strict(),
        ),
      })
      .strict();

    const patchedSchema = applySchemaPatch(sourceSchema, {
      payloadPath: '/results/*',
      replace: {
        zod: z
          .object({
            type: z.enum(['fixedLocation', 'itinerary']),
          })
          .strict(),
      },
    });

    expect(
      patchedSchema.safeParse({
        results: [{ type: 'fixedLocation' }],
      }).success,
    ).toBe(true);
    expect(
      patchedSchema.safeParse({
        results: [{ slug: 'legacy-slug' }],
      }).success,
    ).toBe(false);
  });

  it('applies patch precedence replace -> remove -> set', () => {
    const sourceSchema = z
      .object({
        results: z.array(
          z
            .object({
              slug: z.string(),
            })
            .strict(),
        ),
      })
      .strict();

    const patchedSchema = applySchemaPatch(sourceSchema, {
      payloadPath: '/results/*',
      replace: {
        zod: z
          .object({
            a: z.string(),
            b: z.string(),
          })
          .strict(),
      },
      remove: ['a'],
      set: {
        c: {
          zod: z.number(),
        },
      },
    });

    expect(
      patchedSchema.safeParse({
        results: [{ b: 'ok', c: 1 }],
      }).success,
    ).toBe(true);
    expect(
      patchedSchema.safeParse({
        results: [{ a: 'removed', b: 'ok', c: 1 }],
      }).success,
    ).toBe(false);
  });
});
