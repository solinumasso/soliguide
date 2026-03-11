/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { z } from 'zod';
import { rawProperty } from '../../projection/openapi/openapi.dsl';
import type {
  FieldSpec,
  VersionTransformContext,
} from '../../versioning/versioning.types';

export const placeTypeSchema = z.enum(['place', 'itinerary']);

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function normalizeOpenToday(
  input: unknown,
  context: VersionTransformContext,
): Promise<unknown> {
  const normalizer = context.deps?.normalizeOpenToday;
  if (typeof normalizer === 'function') {
    return normalizer(input);
  }

  return input;
}

export const canonicalNameFieldSpec: FieldSpec = {
  zod: z
    .object({
      originalName: z.string(),
      translatedName: z.string(),
    })
    .strict(),
  openApi: rawProperty(
    {
      type: 'object',
      additionalProperties: false,
      required: ['originalName', 'translatedName'],
      properties: {
        originalName: {
          type: 'string',
          description: 'Original name of the place',
        },
        translatedName: {
          type: 'string',
          description: 'Localized place name in the requested language',
        },
      },
    },
    { required: true },
  ),
};
