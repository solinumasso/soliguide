import { PayloadObjectPath, PayloadFieldKey } from '../../versioning.types';
import {
  AddFieldOperation,
  addFieldOperationHandler,
} from './add-field.operation';
import {
  RequestCustomTransformOperation,
  ResponseCustomTransformOperation,
  customTransformOperationHandler,
} from './custom-transform.operation';
import {
  MergeFieldsOperation,
  mergeFieldsOperationHandler,
} from './merge-fields.operation';
import { OperationHandler } from './operation-handler.types';
import {
  RequestRemoveFieldOperation,
  ResponseRemoveFieldOperation,
  removeFieldOperationHandler,
} from './remove-field.operation';
import {
  RenameFieldOperation,
  renameFieldOperationHandler,
} from './rename-field.operation';
import {
  ReplaceFieldOperation,
  replaceFieldOperationHandler,
} from './replace-field.operation';
import {
  SplitFieldOperation,
  splitFieldOperationHandler,
} from './split-field.operation';

export type RequestOperation<TPayload = unknown> =
  | AddFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | RequestRemoveFieldOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >
  | RenameFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | ReplaceFieldOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >
  | SplitFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | MergeFieldsOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | RequestCustomTransformOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >;

export type ResponseOperation<TPayload = unknown> =
  | AddFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | ResponseRemoveFieldOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >
  | RenameFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | ReplaceFieldOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >
  | SplitFieldOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | MergeFieldsOperation<PayloadObjectPath<TPayload>, PayloadFieldKey<TPayload>>
  | ResponseCustomTransformOperation<
      PayloadObjectPath<TPayload>,
      PayloadFieldKey<TPayload>
    >;

export type OperationKind = RequestOperation['kind'];

export interface OperationHandlerMap {
  addField: OperationHandler<AddFieldOperation, AddFieldOperation>;
  removeField: OperationHandler<
    RequestRemoveFieldOperation,
    ResponseRemoveFieldOperation
  >;
  renameField: OperationHandler<RenameFieldOperation, RenameFieldOperation>;
  replaceField: OperationHandler<ReplaceFieldOperation, ReplaceFieldOperation>;
  splitField: OperationHandler<SplitFieldOperation, SplitFieldOperation>;
  mergeFields: OperationHandler<MergeFieldsOperation, MergeFieldsOperation>;
  customTransform: OperationHandler<
    RequestCustomTransformOperation,
    ResponseCustomTransformOperation
  >;
}

export const operationHandlers: OperationHandlerMap = {
  addField: addFieldOperationHandler,
  removeField: removeFieldOperationHandler,
  renameField: renameFieldOperationHandler,
  replaceField: replaceFieldOperationHandler,
  splitField: splitFieldOperationHandler,
  mergeFields: mergeFieldsOperationHandler,
  customTransform: customTransformOperationHandler,
};
