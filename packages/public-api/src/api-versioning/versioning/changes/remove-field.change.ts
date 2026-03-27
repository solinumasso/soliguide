import type {
  PayloadObjectPath,
  RequestRemoveFieldOperation,
  ResponseRemoveFieldOperation,
} from '../versioning.types';
import {
  Change,
  type FieldKey,
  type MaybeAsync,
  type ResolvedContainer,
} from './change';

export abstract class RemoveFieldChange<
  TPayload = unknown,
  TContainer extends Record<string, unknown> = ResolvedContainer<TPayload>,
> extends Change {
  abstract field: FieldKey<TContainer>;
  payloadPath: PayloadObjectPath<TPayload> = '/';

  abstract downgrade(_container: Record<string, unknown>): MaybeAsync<unknown>;

  override toRequestOperation(): RequestRemoveFieldOperation {
    return {
      kind: 'removeField',
      payloadPath: this.payloadPathValue(),
      field: this.field,
    };
  }

  override toResponseOperation(): ResponseRemoveFieldOperation {
    return {
      kind: 'removeField',
      payloadPath: this.payloadPathValue(),
      field: this.field,
      downgrade: (container) => this.downgrade(container),
    };
  }
}
