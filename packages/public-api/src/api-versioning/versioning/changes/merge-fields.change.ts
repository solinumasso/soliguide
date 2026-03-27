import { z } from 'zod';
import type {
  MergeFieldsOperation,
  PayloadObjectPath,
} from '../versioning.types';
import {
  Change,
  type FieldKey,
  type MaybeAsync,
  type ResolvedContainer,
} from './change';

export abstract class MergeFieldsChange<
  TPayload = unknown,
  TContainer extends Record<string, unknown> = ResolvedContainer<TPayload>,
> extends Change {
  abstract from: readonly FieldKey<TContainer>[];
  abstract to: string;
  payloadPath: PayloadObjectPath<TPayload> = '/';

  abstract schema: z.ZodTypeAny;

  abstract upgrade(
    values: Record<string, unknown>,
    container: Record<string, unknown>,
  ): MaybeAsync<unknown>;

  downgrade(
    _value: unknown,
    _container: Record<string, unknown>,
  ): MaybeAsync<Record<string, unknown>> | undefined {
    return undefined;
  }

  removeSources(): boolean {
    return true;
  }

  override toRequestOperation(): MergeFieldsOperation {
    const downgrade =
      this.downgrade === MergeFieldsChange.prototype.downgrade
        ? undefined
        : (value: unknown, container: Record<string, unknown>) =>
            this.downgrade(
              value,
              container,
            ) as MaybeAsync<Record<string, unknown>>;

    return {
      kind: 'mergeFields',
      payloadPath: this.payloadPathValue(),
      from: this.from,
      to: this.to,
      schema: this.schema,
      upgrade: (values, container) => this.upgrade(values, container),
      downgrade,
      removeSources: this.removeSources(),
    };
  }

  override toResponseOperation(): MergeFieldsOperation {
    const downgrade =
      this.downgrade === MergeFieldsChange.prototype.downgrade
        ? undefined
        : (value: unknown, container: Record<string, unknown>) =>
            this.downgrade(
              value,
              container,
            ) as MaybeAsync<Record<string, unknown>>;

    return {
      kind: 'mergeFields',
      payloadPath: this.payloadPathValue(),
      from: this.from,
      to: this.to,
      schema: this.schema,
      upgrade: (values, container) => this.upgrade(values, container),
      downgrade,
      removeSources: this.removeSources(),
    };
  }
}
