import { z } from 'zod';
import type { SplitFieldOperation } from '../dsl/operations/split-field.operation';
import type { PayloadObjectPath } from '../versioning.types';
import { Change } from './change';
import { FieldKey, ResolvedContainer } from './types';
import { MaybeAsync } from '../../utils';

export abstract class SplitFieldChange<
  TPayload = unknown,
  TContainer extends Record<string, unknown> = ResolvedContainer<TPayload>,
> extends Change {
  abstract from: FieldKey<TContainer>;
  payloadPath: PayloadObjectPath<TPayload> = '/';

  abstract schemas: Readonly<Record<string, z.ZodTypeAny>>;

  abstract upgrade(
    value: unknown,
    container: Record<string, unknown>,
  ): MaybeAsync<Record<string, unknown>>;

  downgrade(
    _values: Record<string, unknown>,
    _container: Record<string, unknown>,
  ): MaybeAsync<unknown> {
    return undefined;
  }

  removeSource(): boolean {
    return true;
  }

  override toRequestOperation(): SplitFieldOperation {
    return {
      kind: 'splitField',
      payloadPath: this.payloadPathValue(),
      from: this.from,
      schemas: this.schemas,
      upgrade: (value, container) => this.upgrade(value, container),
      downgrade: (values, container) => this.downgrade(values, container),
      removeSource: this.removeSource(),
    };
  }

  override toResponseOperation(): SplitFieldOperation {
    return {
      kind: 'splitField',
      payloadPath: this.payloadPathValue(),
      from: this.from,
      schemas: this.schemas,
      upgrade: (value, container) => this.upgrade(value, container),
      downgrade: (values, container) => this.downgrade(values, container),
      removeSource: this.removeSource(),
    };
  }
}
