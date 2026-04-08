import { z } from 'zod';
import { MergeFieldsOperation } from '../dsl/operations/merge-fields.operation';
import { PayloadObjectPath } from '../versioning.types';
import { Change } from './change';
import { FieldKey, ResolvedContainer } from './types';
import { MaybeAsync } from '../../utils';

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
  ): MaybeAsync<Record<string, unknown> | undefined> {
    return undefined;
  }

  removeSources(): boolean {
    return true;
  }

  override toRequestOperation(): MergeFieldsOperation {
    return {
      kind: 'mergeFields',
      payloadPath: this.payloadPathValue(),
      from: this.from,
      to: this.to,
      schema: this.schema,
      upgrade: (values, container) => this.upgrade(values, container),
      downgrade: this.createDowngradeMapper(),
      removeSources: this.removeSources(),
    };
  }

  override toResponseOperation(): MergeFieldsOperation {
    return {
      kind: 'mergeFields',
      payloadPath: this.payloadPathValue(),
      from: this.from,
      to: this.to,
      schema: this.schema,
      upgrade: (values, container) => this.upgrade(values, container),
      downgrade: this.createDowngradeMapper(),
      removeSources: this.removeSources(),
    };
  }

  private createDowngradeMapper():
    | ((
        value: unknown,
        container: Record<string, unknown>,
      ) => MaybeAsync<Record<string, unknown> | undefined>)
    | undefined {
    if (this.downgrade === MergeFieldsChange.prototype.downgrade) {
      return undefined;
    }

    return (value, container) => this.downgrade(value, container);
  }
}
