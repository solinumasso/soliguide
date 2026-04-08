import { isRecord } from '../../../utils';
import { replaceContainer } from '../../object-path.utils';
import { z } from 'zod';
import type { ObjectPath } from '../../versioning.types';
import type { OperationHandler } from './operation-handler.types';

type ContainerMapper = (
  container: Record<string, unknown>,
) => Promise<Record<string, unknown> | void> | Record<string, unknown> | void;

interface CustomTransformSchemaPatch<TField extends string = string> {
  replace?: z.ZodTypeAny;
  set?: Readonly<Record<string, z.ZodTypeAny>>;
  remove?: readonly TField[];
}

export interface RequestCustomTransformOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> {
  kind: 'customTransform';
  payloadPath?: TPayloadPath;
  schemaPatch?: CustomTransformSchemaPatch<TField>;
  upgrade: ContainerMapper;
}

export interface ResponseCustomTransformOperation<
  TPayloadPath extends ObjectPath = ObjectPath,
  TField extends string = string,
> {
  kind: 'customTransform';
  payloadPath?: TPayloadPath;
  schemaPatch?: CustomTransformSchemaPatch<TField>;
  downgrade: ContainerMapper;
}

export const customTransformOperationHandler: OperationHandler<
  RequestCustomTransformOperation,
  ResponseCustomTransformOperation
> = {
  compileSchemaPatch(operation, context) {
    return {
      payloadPath: context.payloadPath,
      replace: operation.schemaPatch?.replace
        ? context.normalizeSchema(operation.schemaPatch.replace)
        : undefined,
      set: operation.schemaPatch?.set
        ? context.normalizeSchemaMap(operation.schemaPatch.set)
        : undefined,
      remove: operation.schemaPatch?.remove,
    };
  },

  async applyRequest(operation, container) {
    const result = await operation.upgrade(container);
    if (isRecord(result)) {
      replaceContainer(container, result);
    }
  },

  async applyResponse(operation, container) {
    const result = await operation.downgrade(container);
    if (isRecord(result)) {
      replaceContainer(container, result);
    }
  },
};
