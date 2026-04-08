import { MaybeAsync } from '../../utils';
import {
  RequestRemoveFieldOperation,
  ResponseRemoveFieldOperation,
} from '../dsl/operations/remove-field.operation';
import { PayloadObjectPath } from '../versioning.types';
import { Change } from './change';
import { FieldKey, ResolvedContainer } from './types';

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
