import { z } from 'zod';
import { ReplaceFieldOperation } from '../dsl/operations/replace-field.operation';
import { PayloadObjectPath } from '../versioning.types';
import { Change } from './change';
import { FieldKey, ResolvedContainer } from './types';
import { MaybeAsync } from '../../utils';

export abstract class ReplaceFieldChange<
  TPayload = unknown,
  TContainer extends Record<string, unknown> = ResolvedContainer<TPayload>,
> extends Change {
  abstract field: FieldKey<TContainer>;
  payloadPath: PayloadObjectPath<TPayload> = '/';

  abstract schema: z.ZodTypeAny;

  upgrade(
    value: unknown,
    _container: Record<string, unknown>,
  ): MaybeAsync<unknown> {
    return value;
  }

  downgrade(
    value: unknown,
    _container: Record<string, unknown>,
  ): MaybeAsync<unknown> {
    return value;
  }

  override toRequestOperation(): ReplaceFieldOperation {
    return {
      kind: 'replaceField',
      payloadPath: this.payloadPathValue(),
      field: this.field,
      schema: this.schema,
      upgrade: (value, container) => this.upgrade(value, container),
      downgrade: (value, container) => this.downgrade(value, container),
    };
  }

  override toResponseOperation(): ReplaceFieldOperation {
    return {
      kind: 'replaceField',
      payloadPath: this.payloadPathValue(),
      field: this.field,
      schema: this.schema,
      upgrade: (value, container) => this.upgrade(value, container),
      downgrade: (value, container) => this.downgrade(value, container),
    };
  }
}
