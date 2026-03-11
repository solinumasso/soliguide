import { z } from 'zod';

export const v20260303RequestSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  openToday: z.coerce.boolean().optional(),
}).strict();

export type v20260303RequestSchemaType = z.infer<typeof v20260303RequestSchema>;

export default v20260303RequestSchema;
