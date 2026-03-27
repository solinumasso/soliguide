import { z } from 'zod';
import { searchResponseSchema } from '../../schema/search.response/search.response';

export const v20260323ResponseSchema = searchResponseSchema;

export type v20260323ResponseSchemaType = z.infer<
  typeof v20260323ResponseSchema
>;

export default v20260323ResponseSchema;
