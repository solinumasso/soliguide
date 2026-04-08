import { z } from 'zod';
import { removeKey, removeKeys } from '../../object-path.utils';
import { ObjectPath } from '../../versioning.types';
import { OperationHandler } from './operation-handler.types';
import { MaybeAsync } from '../../../utils';

type SplitMapper = (
  value: unknown,
  container: Record<string, unknown>,
) => Promise<Record<string, unknown>> | Record<string, unknown>;

type MergeMapper = (
  values: Record<string, unknown>,
  container: Record<string, unknown>,
) => MaybeAsync<unknown>;

export interface SplitFieldOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> {
  kind: 'splitField';
  payloadPath?: TPayloadPath;
  from: TFrom;
  schemas: Readonly<Record<string, z.ZodTypeAny>>;
  upgrade: SplitMapper;
  downgrade?: MergeMapper;
  removeSource?: boolean;
}

export const splitFieldOperationHandler: OperationHandler<
  SplitFieldOperation,
  SplitFieldOperation
> = {
  compileSchemaPatch(operation, context) {
    return {
      payloadPath: context.payloadPath,
      remove: (operation.removeSource ?? true) ? [operation.from] : [],
      set: context.normalizeSchemaMap(operation.schemas),
    };
  },

  async applyRequest(operation, container) {
    if (!(operation.from in container)) {
      return;
    }

    const upgradeResult = await operation.upgrade(
      container[operation.from],
      container,
    );
    for (const [field, value] of Object.entries(upgradeResult)) {
      container[field] = value;
    }

    if (operation.removeSource ?? true) {
      removeKey(container, operation.from);
    }
  },

  async applyResponse(operation, container) {
    if (!operation.downgrade) {
      return;
    }

    const values = Object.keys(operation.schemas).reduce<
      Record<string, unknown>
    >((accumulator, field) => {
      accumulator[field] = container[field];
      return accumulator;
    }, {});

    container[operation.from] = await operation.downgrade(values, container);
    removeKeys(container, Object.keys(operation.schemas));
  },
};
