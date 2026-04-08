import { z } from 'zod';

import { removeKey } from '../../object-path.utils';
import { ObjectPath } from '../../versioning.types';
import { OperationHandler } from './operation-handler.types';
import { MaybeAsync } from '../../../utils';

export interface AddFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> {
  kind: 'addField';
  payloadPath?: TPayloadPath;
  field: TField;
  schema: z.ZodTypeAny;
  upgrade?: (container: Record<string, unknown>) => MaybeAsync<unknown>;
}

export const addFieldOperationHandler: OperationHandler<
  AddFieldOperation,
  AddFieldOperation
> = {
  compileSchemaPatch(operation, context) {
    return {
      payloadPath: context.payloadPath,
      set: {
        [operation.field]: context.normalizeSchema(operation.schema),
      },
    };
  },

  async applyRequest(operation, container) {
    if (operation.field in container || !operation.upgrade) {
      return;
    }

    container[operation.field] = await operation.upgrade(container);
  },

  applyResponse(operation, container) {
    removeKey(container, operation.field);
  },
};
