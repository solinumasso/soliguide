import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import {
  isRecord,
  removeKey,
  removeKeys,
  replaceContainer,
  transformContainersAtPath,
} from './object-path.utils';
import type {
  RequestChangeDefinition,
  ResponseChangeDefinition,
} from './changes/change';
import {
  annotateZodSchemaExpression,
  readZodSchemaExpression,
} from './zod-schema-expression.utils';
import type {
  CompiledRequestChange,
  CompiledResponseChange,
  CompiledSchemaPatch,
  CompiledVersion,
  FieldSpec,
  RequestOperation,
  ResponseOperation,
  Version,
} from './versioning.types';

const DEFAULT_PAYLOAD_PATH = '/';

@Injectable()
export class DslCompiler {
  compileRequestChange(change: RequestChangeDefinition): CompiledRequestChange {
    const operation = change.toRequestOperation();
    const schemaPatch = this.compileSchemaPatch(change, operation);

    return {
      description: change.description,
      schemaPatch,
      upgrade: (payload: unknown) =>
        transformContainersAtPath(
          payload,
          schemaPatch.payloadPath,
          async (container) => this.applyRequestOperation(operation, container),
        ),
    };
  }

  compileResponseChange(
    change: ResponseChangeDefinition,
  ): CompiledResponseChange {
    const operation = change.toResponseOperation();
    const schemaPatch = this.compileSchemaPatch(change, operation);

    return {
      description: change.description,
      schemaPatch,
      downgrade: (payload: unknown) =>
        transformContainersAtPath(
          payload,
          schemaPatch.payloadPath,
          async (container) =>
            this.applyResponseOperation(operation, container),
        ),
    };
  }

  compileVersion(version: Version): CompiledVersion {
    return {
      version: version.version,
      description: version.description,
      requestChanges: version.requestChanges.map((change) =>
        this.compileRequestChange(change),
      ),
      responseChanges: version.responseChanges.map((change) =>
        this.compileResponseChange(change),
      ),
    };
  }

  compileVersions(versions: readonly Version[]): readonly CompiledVersion[] {
    return versions.map((version) => this.compileVersion(version));
  }

  private compileSchemaPatch(
    change: RequestChangeDefinition,
    operation: RequestOperation | ResponseOperation,
  ): CompiledSchemaPatch {
    const payloadPath = operation.payloadPath ?? DEFAULT_PAYLOAD_PATH;

    switch (operation.kind) {
      case 'addField':
        return {
          payloadPath,
          set: {
            [operation.field]: this.normalizeSchema(change, operation.schema),
          },
        };
      case 'removeField':
        return {
          payloadPath,
          remove: [operation.field],
        };
      case 'renameField':
        return {
          payloadPath,
          remove: [operation.from],
          set: {
            [operation.to]: this.normalizeSchema(change, operation.schema),
          },
        };
      case 'replaceField':
        return {
          payloadPath,
          set: {
            [operation.field]: this.normalizeSchema(change, operation.schema),
          },
        };
      case 'splitField':
        return {
          payloadPath,
          remove: (operation.removeSource ?? true) ? [operation.from] : [],
          set: this.normalizeSchemaMap(change, operation.schemas),
        };
      case 'mergeFields':
        return {
          payloadPath,
          remove: (operation.removeSources ?? true) ? [...operation.from] : [],
          set: {
            [operation.to]: this.normalizeSchema(change, operation.schema),
          },
        };
      case 'customTransform':
        return {
          payloadPath,
          set: operation.schemaPatch?.set
            ? this.normalizeSchemaMap(change, operation.schemaPatch.set)
            : undefined,
          remove: operation.schemaPatch?.remove,
        };
      default:
        return this.assertNever(operation);
    }
  }

  private async applyRequestOperation(
    operation: RequestOperation,
    container: Record<string, unknown>,
  ): Promise<void> {
    switch (operation.kind) {
      case 'addField': {
        if (operation.field in container || !operation.upgrade) {
          return;
        }

        container[operation.field] = await operation.upgrade(container);
        return;
      }
      case 'removeField': {
        removeKey(container, operation.field);
        return;
      }
      case 'renameField': {
        if (!(operation.from in container)) {
          return;
        }

        if (!(operation.to in container)) {
          const upgrade = operation.upgrade ?? ((value: unknown) => value);
          container[operation.to] = await upgrade(
            container[operation.from],
            container,
          );
        }

        removeKey(container, operation.from);
        return;
      }
      case 'replaceField': {
        container[operation.field] = await operation.upgrade(
          container[operation.field],
          container,
        );
        return;
      }
      case 'splitField': {
        if (!(operation.from in container)) {
          return;
        }

        const upgradeResult = await operation.upgrade(
          container[operation.from],
          container,
        );
        for (const [field, value] of Object.entries(upgradeResult)) {
          container[field] = value;
        }

        if (operation.removeSource ?? true) {
          removeKey(container, operation.from);
        }

        return;
      }
      case 'mergeFields': {
        const hasAnySource = operation.from.some((field) => field in container);
        if (!hasAnySource) {
          return;
        }

        const values = operation.from.reduce<Record<string, unknown>>(
          (accumulator, field) => {
            accumulator[field] = container[field];
            return accumulator;
          },
          {},
        );

        container[operation.to] = await operation.upgrade(values, container);

        if (operation.removeSources ?? true) {
          removeKeys(container, operation.from);
        }

        return;
      }
      case 'customTransform': {
        const result = await operation.upgrade(container);
        if (isRecord(result)) {
          replaceContainer(container, result);
        }
        return;
      }
      default:
        this.assertNever(operation);
    }
  }

  private async applyResponseOperation(
    operation: ResponseOperation,
    container: Record<string, unknown>,
  ): Promise<void> {
    switch (operation.kind) {
      case 'addField': {
        removeKey(container, operation.field);
        return;
      }
      case 'removeField': {
        container[operation.field] = await operation.downgrade(container);
        return;
      }
      case 'renameField': {
        if (!(operation.to in container)) {
          return;
        }

        if (!(operation.from in container)) {
          const downgrade = operation.downgrade ?? ((value: unknown) => value);
          container[operation.from] = await downgrade(
            container[operation.to],
            container,
          );
        }

        removeKey(container, operation.to);
        return;
      }
      case 'replaceField': {
        const downgrade = operation.downgrade ?? ((value: unknown) => value);
        container[operation.field] = await downgrade(
          container[operation.field],
          container,
        );
        return;
      }
      case 'splitField': {
        if (!operation.downgrade) {
          return;
        }

        const values = Object.keys(operation.schemas).reduce<
          Record<string, unknown>
        >((accumulator, field) => {
          accumulator[field] = container[field];
          return accumulator;
        }, {});

        container[operation.from] = await operation.downgrade(values, container);
        removeKeys(container, Object.keys(operation.schemas));
        return;
      }
      case 'mergeFields': {
        if (!(operation.to in container) || !operation.downgrade) {
          return;
        }

        const downgradeResult = await operation.downgrade(
          container[operation.to],
          container,
        );
        if (!downgradeResult) {
          return;
        }

        for (const [field, value] of Object.entries(downgradeResult)) {
          container[field] = value;
        }

        removeKey(container, operation.to);
        return;
      }
      case 'customTransform': {
        const result = await operation.downgrade(container);
        if (isRecord(result)) {
          replaceContainer(container, result);
        }
        return;
      }
      default:
        this.assertNever(operation);
    }
  }

  private assertNever(value: never): never {
    throw new Error(
      `Unsupported versioning operation kind: ${(value as { kind?: string }).kind ?? 'unknown'}.`,
    );
  }

  private normalizeSchemaMap(
    change: RequestChangeDefinition,
    schemas: Readonly<Record<string, z.ZodTypeAny>>,
  ): Readonly<Record<string, FieldSpec>> {
    const nextSet: Record<string, FieldSpec> = {};
    for (const [field, schema] of Object.entries(schemas)) {
      nextSet[field] = this.normalizeSchema(change, schema);
    }
    return nextSet;
  }

  private normalizeSchema(
    change: RequestChangeDefinition,
    schema: z.ZodTypeAny,
  ): FieldSpec {
    const existingExpression = readZodSchemaExpression(schema);
    if (existingExpression) {
      return { zod: schema };
    }

    const extractedExpression =
      this.readSchemaExpressionProperty(change, 'schemaExpression') ??
      this.extractAssignedSchemaExpression(change, 'schema');

    if (!extractedExpression) {
      return { zod: schema };
    }

    return {
      zod: annotateZodSchemaExpression(schema, extractedExpression),
    };
  }

  private readSchemaExpressionProperty(
    change: RequestChangeDefinition,
    propertyName: string,
  ): string | undefined {
    const value = Reflect.get(change as object, propertyName);
    if (typeof value !== 'string') {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private extractAssignedSchemaExpression(
    change: RequestChangeDefinition,
    propertyName: string,
  ): string | undefined {
    const constructorSource = Function.prototype.toString.call(
      change.constructor,
    );
    const escapedProperty = propertyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const instanceAssignmentPattern = new RegExp(
      `this\\.${escapedProperty}\\s*=\\s*([\\s\\S]*?);`,
    );
    const instanceAssignmentMatch = constructorSource.match(
      instanceAssignmentPattern,
    );
    if (instanceAssignmentMatch?.[1]) {
      const expression = instanceAssignmentMatch[1].trim();
      return expression.length > 0 ? expression : undefined;
    }

    const classFieldPattern = new RegExp(
      `${escapedProperty}\\s*=\\s*([\\s\\S]*?);`,
    );
    const classFieldMatch = constructorSource.match(classFieldPattern);
    if (!classFieldMatch?.[1]) {
      return undefined;
    }

    const expression = classFieldMatch[1].trim();
    return expression.length > 0 ? expression : undefined;
  }
}
