import { z } from 'zod';
import { searchRequestSchema } from '../../schema/search.request/search.request';

export const v20260323RequestSchema = searchRequestSchema;

export type v20260323RequestSchemaType = z.infer<typeof v20260323RequestSchema>;

export default v20260323RequestSchema;
