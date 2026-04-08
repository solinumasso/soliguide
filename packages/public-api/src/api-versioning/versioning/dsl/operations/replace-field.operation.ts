import { z } from 'zod';
import { ObjectPath } from '../../versioning.types';
import { OperationHandler } from './operation-handler.types';
import { MaybeAsync } from '../../../utils';

type ValueMapper = (
  value: unknown,
  container: Record<string, unknown>,
) => MaybeAsync<unknown>;

export interface ReplaceFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> {
  kind: 'replaceField';
  payloadPath?: TPayloadPath;
  field: TField;
  schema: z.ZodTypeAny;
  upgrade: ValueMapper;
  downgrade?: ValueMapper;
}

export const replaceFieldOperationHandler: OperationHandler<
  ReplaceFieldOperation,
  ReplaceFieldOperation
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
    container[operation.field] = await operation.upgrade(
      container[operation.field],
      container,
    );
  },

  async applyResponse(operation, container) {
    const downgrade = operation.downgrade ?? ((value: unknown) => value);
    container[operation.field] = await downgrade(
      container[operation.field],
      container,
    );
  },
};
