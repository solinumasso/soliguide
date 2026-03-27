import { z } from 'zod';
import type { AddFieldOperation, PayloadObjectPath } from '../versioning.types';
import {
  Change,
  type FieldKey,
  type MaybeAsync,
  type ResolvedContainer,
} from './change';

export abstract class AddFieldChange<
  TPayload = unknown,
  TContainer extends Record<string, unknown> = ResolvedContainer<TPayload>,
> extends Change {
  abstract field: FieldKey<TContainer>;
  payloadPath: PayloadObjectPath<TPayload> = '/';

  abstract schema: z.ZodTypeAny;

  upgrade?(_container: Record<string, unknown>): MaybeAsync<unknown>;

  override toRequestOperation(): AddFieldOperation {
    return {
      kind: 'addField',
      payloadPath: this.payloadPathValue(),
      field: this.field,
      schema: this.schema,
      upgrade: this.upgrade
        ? (container) => this.upgrade!(container)
        : undefined,
    };
  }

  override toResponseOperation(): AddFieldOperation {
    return {
      kind: 'addField',
      payloadPath: this.payloadPathValue(),
      field: this.field,
      schema: this.schema,
      upgrade: this.upgrade
        ? (container) => this.upgrade!(container)
        : undefined,
    };
  }
}
