import { z } from 'zod';

export const v20260309ResponseSchema = z.object({
  _links: z.object({
    self: z.object({
      href: z.string(),
    }).strict(),
    next: z.object({
      href: z.string(),
    }).strict(),
    prev: z.object({
      href: z.string(),
    }).strict(),
  }).strict(),
  results: z.array(z.object({
    id: z.string(),
    name: z.object({
      originalName: z.string(),
      translatedName: z.string(),
    }).strict(),
    description: z.string(),
    type: z.enum(["place", "itinerary"]),
    isOpenToday: z.boolean(),
    languages: z.array(z.string()),
    seoUrl: z.string(),
  }).strict()),
  page: z.object({
    current: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(1),
    totalResults: z.number().int().min(0),
  }).strict(),
}).strict();

export type v20260309ResponseSchemaType = z.infer<typeof v20260309ResponseSchema>;

export default v20260309ResponseSchema;
