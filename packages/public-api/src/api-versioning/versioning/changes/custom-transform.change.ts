import { z } from 'zod';
import type {
  PayloadObjectPath,
  RequestCustomTransformOperation,
  ResponseCustomTransformOperation,
} from '../versioning.types';
import { Change, type MaybeAsync } from './change';

export abstract class CustomTransformChange<TPayload = unknown> extends Change {
  payloadPath: PayloadObjectPath<TPayload> = '/';

  protected schemaPatchSet():
    | Readonly<Record<string, z.ZodTypeAny>>
    | undefined {
    return undefined;
  }

  protected schemaPatchRemove(): readonly string[] | undefined {
    return undefined;
  }

  upgrade(
    _container: Record<string, unknown>,
  ): MaybeAsync<Record<string, unknown> | void> {
    return undefined;
  }

  downgrade(
    _container: Record<string, unknown>,
  ): MaybeAsync<Record<string, unknown> | void> {
    return undefined;
  }

  get schemaPatch():
    | {
        set?: Readonly<Record<string, z.ZodTypeAny>>;
        remove?: readonly string[];
      }
    | undefined {
    const set = this.schemaPatchSet();
    const remove = this.schemaPatchRemove();
    return set || remove ? { set, remove } : undefined;
  }

  override toRequestOperation(): RequestCustomTransformOperation {
    return {
      kind: 'customTransform',
      payloadPath: this.payloadPathValue(),
      schemaPatch: this.schemaPatch,
      upgrade: (container) => this.upgrade(container),
    };
  }

  override toResponseOperation(): ResponseCustomTransformOperation {
    return {
      kind: 'customTransform',
      payloadPath: this.payloadPathValue(),
      schemaPatch: this.schemaPatch,
      downgrade: (container) => this.downgrade(container),
    };
  }
}
