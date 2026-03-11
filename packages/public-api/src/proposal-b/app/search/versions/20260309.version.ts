import { z } from 'zod';
import { apiProperty } from '../../../projection/openapi/openapi.dsl';
import {
  canonicalNameFieldSpec,
  isRecord,
  normalizeOpenToday,
} from '../search.shared';
import type { Version } from '../../../versioning/versioning.types';

export const searchVersion20260309: Version = {
  version: '2026-03-09',
  description:
    'Renamed fields for clearer semantics and richer naming payload.',
  requestChanges: [
    {
      description: 'Renamed request query field openToday to isOpenToday.',
      operation: {
        kind: 'renameField',
        from: 'openToday',
        to: 'isOpenToday',
        payloadPath: '/',
        openApiPath: '/',
        toSpec: {
          zod: z.coerce.boolean().optional(),
          openApi: apiProperty({
            type: Boolean,
            required: false,
            description: 'Filter places open today.',
          }),
        },
        mapValue: (value, context) => normalizeOpenToday(value, context),
      },
    },
  ],
  responseChanges: [
    {
      description: 'Renamed response field slug to seoUrl.',
      operation: {
        kind: 'renameField',
        from: 'slug',
        to: 'seoUrl',
        payloadPath: '/results/*',
        openApiPath: '/properties/results/items',
        toSpec: {
          zod: z.string(),
          openApi: apiProperty({
            type: String,
            description: 'URL-friendly identifier of the place',
            example:
              'croix-rouge-francaise-antenne-locale-de-saint-benoit-43510',
            nullable: false,
            required: true,
          }),
        },
      },
    },
    {
      description:
        'Expanded response field name from string to object containing original and translated names.',
      operation: {
        kind: 'replaceField',
        field: 'name',
        payloadPath: '/results/*',
        openApiPath: '/properties/results/items',
        spec: canonicalNameFieldSpec,
        mapValue: (value) => {
          if (typeof value !== 'string') {
            return value;
          }

          return {
            originalName: value,
            translatedName: value,
          };
        },
        downgradeValue: (value) => {
          if (!isRecord(value)) {
            return value;
          }

          if (typeof value.translatedName === 'string') {
            return value.translatedName;
          }

          if (typeof value.originalName === 'string') {
            return value.originalName;
          }

          return value;
        },
      },
    },
  ],
};
