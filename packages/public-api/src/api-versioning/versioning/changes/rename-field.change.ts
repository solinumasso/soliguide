import { z } from 'zod';
import { RenameFieldOperation } from '../dsl/operations/rename-field.operation';
import { PayloadObjectPath } from '../versioning.types';
import { Change } from './change';
import { FieldKey, ResolvedContainer } from './types';
import { MaybeAsync } from '../../utils';

export abstract class RenameFieldChange<
  TPayload = unknown,
  TContainer extends Record<string, unknown> = ResolvedContainer<TPayload>,
> extends Change {
  abstract from: FieldKey<TContainer>;
  abstract to: string;
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

  override toRequestOperation(): RenameFieldOperation {
    return {
      kind: 'renameField',
      payloadPath: this.payloadPathValue(),
      from: this.from,
      to: this.to,
      schema: this.schema,
      upgrade: (value, container) => this.upgrade(value, container),
      downgrade: (value, container) => this.downgrade(value, container),
    };
  }

  override toResponseOperation(): RenameFieldOperation {
    return {
      kind: 'renameField',
      payloadPath: this.payloadPathValue(),
      from: this.from,
      to: this.to,
      schema: this.schema,
      upgrade: (value, container) => this.upgrade(value, container),
      downgrade: (value, container) => this.downgrade(value, container),
    };
  }
}
