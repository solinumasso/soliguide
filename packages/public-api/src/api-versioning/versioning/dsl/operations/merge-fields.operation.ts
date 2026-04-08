import { removeKey, removeKeys } from '../../object-path.utils';
import { z } from 'zod';
import {
  ObjectPath,
  type ResponseDowngradeContext,
} from '../../versioning.types';
import { OperationHandler } from './operation-handler.types';
import { MaybeAsync } from '../../../utils';

type SplitMapper = (
  value: unknown,
  container: Record<string, unknown>,
  context?: ResponseDowngradeContext,
) => MaybeAsync<Record<string, unknown> | undefined>;

type MergeMapper = (
  values: Record<string, unknown>,
  container: Record<string, unknown>,
) => MaybeAsync<unknown>;

export interface MergeFieldsOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TFrom extends string = string,
> {
  kind: 'mergeFields';
  payloadPath?: TPayloadPath;
  from: readonly TFrom[];
  to: string;
  schema: z.ZodTypeAny;
  upgrade: MergeMapper;
  downgrade?: SplitMapper;
  removeSources?: boolean;
}

export const mergeFieldsOperationHandler: OperationHandler<
  MergeFieldsOperation,
  MergeFieldsOperation
> = {
  compileSchemaPatch(operation, context) {
    return {
      payloadPath: context.payloadPath,
      remove: (operation.removeSources ?? true) ? [...operation.from] : [],
      set: {
        [operation.to]: context.normalizeSchema(operation.schema),
      },
    };
  },

  async applyRequest(operation, container) {
    const hasAnySource = operation.from.some((field) => field in container);
    if (!hasAnySource) {
      return;
    }

    const values = operation.from.reduce<Record<string, unknown>>(
      (accumulator, field) => {
        accumulator[field] = container[field];
        return accumulator;
      },
      {},
    );

    container[operation.to] = await operation.upgrade(values, container);

    if (operation.removeSources ?? true) {
      removeKeys(container, operation.from);
    }
  },

  async applyResponse(operation, container, context) {
    if (!(operation.to in container) || !operation.downgrade) {
      return;
    }

    const downgradeResult = await operation.downgrade(
      container[operation.to],
      container,
      context,
    );
    if (downgradeResult === undefined) {
      return;
    }

    for (const [field, value] of Object.entries(downgradeResult)) {
      container[field] = value;
    }

    removeKey(container, operation.to);
  },
};
