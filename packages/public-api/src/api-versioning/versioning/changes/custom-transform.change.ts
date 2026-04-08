import { z } from 'zod';
import { PayloadObjectPath } from '../versioning.types';
import type {
  RequestCustomTransformOperation,
  ResponseCustomTransformOperation,
} from '../dsl/operations/custom-transform.operation';
import { Change } from './change';
import {
  MaybeAsync,
  extractMethodReturnExpression,
  extractMethodReturnedObjectPropertyExpressions,
} from '../../utils';
import {
  annotateZodSchemaExpression,
  readZodSchemaExpression,
} from '../zod-schema-expression.utils';

export abstract class CustomTransformChange<TPayload = unknown> extends Change {
  payloadPath: PayloadObjectPath<TPayload> = '/';

  protected schemaPatchSet():
    | Readonly<Record<string, z.ZodTypeAny>>
    | undefined {
    return undefined;
  }

  protected schemaPatchReplace(): z.ZodTypeAny | undefined {
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
        replace?: z.ZodTypeAny;
        set?: Readonly<Record<string, z.ZodTypeAny>>;
        remove?: readonly string[];
      }
    | undefined {
    this.sourceFilePath =
      this.captureSubclassSourceFilePath() ?? this.sourceFilePath;

    const replace = this.schemaPatchReplace();
    const set = this.schemaPatchSet();
    const remove = this.schemaPatchRemove();

    this.annotateReplaceSchemaExpression(replace);
    this.annotateSetSchemaExpressions(set);

    return replace || set || remove ? { replace, set, remove } : undefined;
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

  private annotateReplaceSchemaExpression(
    schema: z.ZodTypeAny | undefined,
  ): void {
    if (!schema || readZodSchemaExpression(schema)) {
      return;
    }

    const expression = extractMethodReturnExpression(
      this.schemaPatchReplace.toString(),
    );
    if (!expression) {
      return;
    }

    annotateZodSchemaExpression(schema, expression);
  }

  private annotateSetSchemaExpressions(
    schemas: Readonly<Record<string, z.ZodTypeAny>> | undefined,
  ): void {
    if (!schemas) {
      return;
    }

    const expressionsByField = extractMethodReturnedObjectPropertyExpressions(
      this.schemaPatchSet.toString(),
    );

    for (const [field, schema] of Object.entries(schemas)) {
      if (readZodSchemaExpression(schema)) {
        continue;
      }

      const expression = expressionsByField[field];
      if (!expression) {
        continue;
      }

      annotateZodSchemaExpression(schema, expression);
    }
  }

  private captureSubclassSourceFilePath(): string | undefined {
    const stack = new Error().stack;
    if (!stack) {
      return undefined;
    }

    const lines = stack.split('\n').slice(1);
    for (const line of lines) {
      const frame = line.trim();
      const withParentheses = frame.match(/\((.+):\d+:\d+\)$/);
      const bare = frame.match(/at (.+):\d+:\d+$/);
      const candidate = withParentheses?.[1] ?? bare?.[1];
      if (!candidate) {
        continue;
      }

      if (
        candidate.includes(
          '/api-versioning/versioning/changes/custom-transform.change.',
        ) ||
        candidate.startsWith('node:') ||
        candidate.includes('internal/')
      ) {
        continue;
      }

      return candidate;
    }

    return undefined;
  }
}
