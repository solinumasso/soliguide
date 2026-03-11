import { z } from 'zod';
import type { ApiVersion } from '../../versioning/versioning.types';
import { v20260303RequestSchema } from './2026-03-03.request.schema';
import { v20260303ResponseSchema } from './2026-03-03.response.schema';
import { v20260309RequestSchema } from './2026-03-09.request.schema';
import { v20260309ResponseSchema } from './2026-03-09.response.schema';

export const requestSchemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny> = new Map<ApiVersion, z.ZodTypeAny>([
  ['2026-03-03', v20260303RequestSchema] as [ApiVersion, z.ZodTypeAny],
  ['2026-03-09', v20260309RequestSchema] as [ApiVersion, z.ZodTypeAny],
]);

export const responseSchemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny> = new Map<ApiVersion, z.ZodTypeAny>([
  ['2026-03-03', v20260303ResponseSchema] as [ApiVersion, z.ZodTypeAny],
  ['2026-03-09', v20260309ResponseSchema] as [ApiVersion, z.ZodTypeAny],
]);
