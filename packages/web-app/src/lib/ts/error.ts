import { z } from 'zod';

const errorSchema = z
  .object({
    message: z.string().optional(),
    status: z.number().optional(),
    statusText: z.string().optional()
  })
  .or(z.string());

export const getErrorValue = (value: unknown): z.infer<typeof errorSchema> | null => {
  const error = errorSchema.safeParse(value);

  if (error.success) {
    return error.data;
  }

  return null;
};
