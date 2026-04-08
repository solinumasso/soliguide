import { RenameFieldChange } from 'src/api-versioning/versioning';
import z from 'zod';

export class FreeTextUpdateChange extends RenameFieldChange {
  from = 'from';
  to = 'to';
  schema = z
    .string()
    .min(1)
    .optional()
    .describe('Free-text query applied to searchable content.')
    .meta({
      example: 'family shelter',
    });
  description = `Rename the query "word" used to free-text query by "q", which is a more common pattern`;
}
