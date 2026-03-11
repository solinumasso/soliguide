import { z } from 'zod';

export const v20260309RequestSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  isOpenToday: z.coerce.boolean().optional(),
}).strict();

export type v20260309RequestSchemaType = z.infer<typeof v20260309RequestSchema>;

export default v20260309RequestSchema;
