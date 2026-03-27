import { z } from 'zod';
import { v20260323RequestSchema } from './2026-03-23.request.schema';
import { v20260323ResponseSchema } from './2026-03-23.response.schema';

type ApiVersion = `${number}-${number}-${number}`;

export const requestSchemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny> = new Map<ApiVersion, z.ZodTypeAny>(
[
  ['2026-03-23', v20260323RequestSchema] as [ApiVersion, z.ZodTypeAny],
]);

export const responseSchemasByVersion: ReadonlyMap<ApiVersion, z.ZodTypeAny> = new Map<ApiVersion, z.ZodTypeAny>(
[
  ['2026-03-23', v20260323ResponseSchema] as [ApiVersion, z.ZodTypeAny],
]);
