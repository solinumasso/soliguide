import { z } from 'zod';

import { removeKey } from '../../object-path.utils';
import { ObjectPath } from '../../versioning.types';
import { OperationHandler } from './operation-handler.types';
import { MaybeAsync } from '../../../utils';

type ValueMapper = (
  value: unknown,
  container: Record<string, unknown>,
) => MaybeAsync<unknown>;

export interface RenameFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> {
  kind: 'renameField';
  payloadPath?: TPayloadPath;
  from: TFrom;
  to: string;
  schema: z.ZodTypeAny;
  upgrade?: ValueMapper;
  downgrade?: ValueMapper;
}

export const renameFieldOperationHandler: OperationHandler<
  RenameFieldOperation,
  RenameFieldOperation
> = {
  compileSchemaPatch(operation, context) {
    return {
      payloadPath: context.payloadPath,
      remove: [operation.from],
      set: {
        [operation.to]: context.normalizeSchema(operation.schema),
      },
    };
  },

  async applyRequest(operation, container) {
    if (!(operation.from in container)) {
      return;
    }

    if (!(operation.to in container)) {
      const upgrade = operation.upgrade ?? ((value: unknown) => value);
      container[operation.to] = await upgrade(
        container[operation.from],
        container,
      );
    }

    removeKey(container, operation.from);
  },

  async applyResponse(operation, container) {
    if (!(operation.to in container)) {
      return;
    }

    if (!(operation.from in container)) {
      const downgrade = operation.downgrade ?? ((value: unknown) => value);
      container[operation.from] = await downgrade(
        container[operation.to],
        container,
      );
    }

    removeKey(container, operation.to);
  },
};
