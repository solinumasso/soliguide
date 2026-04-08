import { removeKey } from '../../object-path.utils';
import { ObjectPath } from '../../versioning.types';
import { OperationHandler } from './operation-handler.types';
import { MaybeAsync } from '../../../utils';

export interface RequestRemoveFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> {
  kind: 'removeField';
  payloadPath?: TPayloadPath;
  field: TField;
}

export interface ResponseRemoveFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> {
  kind: 'removeField';
  payloadPath?: TPayloadPath;
  field: TField;
  downgrade: (container: Record<string, unknown>) => MaybeAsync<unknown>;
}

export const removeFieldOperationHandler: OperationHandler<
  RequestRemoveFieldOperation,
  ResponseRemoveFieldOperation
> = {
  compileSchemaPatch(operation, context) {
    return {
      payloadPath: context.payloadPath,
      remove: [operation.field],
    };
  },

  applyRequest(operation, container) {
    removeKey(container, operation.field);
  },

  async applyResponse(operation, container) {
    container[operation.field] = await operation.downgrade(container);
  },
};
