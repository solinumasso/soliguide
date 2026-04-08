import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import {
  extractAssignedPropertyExpression,
  readStringProperty,
} from '../../utils';
import { transformContainersAtPath } from '../object-path.utils';
import {
  annotateZodSchemaExpression,
  readZodSchemaExpression,
} from '../zod-schema-expression.utils';
import type {
  CompiledRequestChange,
  CompiledResponseChange,
  CompiledSchemaPatch,
  CompiledVersion,
  FieldSpec,
  Version,
} from '../versioning.types';
import {
  operationHandlers,
  type RequestOperation,
  type ResponseOperation,
} from './operations';
import { Change } from '../changes';

const DEFAULT_PAYLOAD_PATH = '/';

@Injectable()
export class DslCompiler {
  compileRequestChange(change: Change): CompiledRequestChange {
    const operation = change.toRequestOperation();
    const schemaPatch = this.compileSchemaPatch(change, operation);

    return {
      changeClassName: change.constructor.name,
      description: change.description,
      sourceFilePath: this.readChangeSourceFilePath(change),
      schemaPatch,
      upgrade: (payload: unknown) =>
        transformContainersAtPath(
          payload,
          schemaPatch.payloadPath,
          async (container) => this.applyRequestOperation(operation, container),
        ),
    };
  }

  compileResponseChange(change: Change): CompiledResponseChange {
    const operation = change.toResponseOperation();
    const schemaPatch = this.compileSchemaPatch(change, operation);

    return {
      changeClassName: change.constructor.name,
      description: change.description,
      sourceFilePath: this.readChangeSourceFilePath(change),
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
    change: Change,
    operation: RequestOperation | ResponseOperation,
  ): CompiledSchemaPatch {
    const payloadPath = operation.payloadPath ?? DEFAULT_PAYLOAD_PATH;
    const context = this.createSchemaCompilationContext(change, payloadPath);

    switch (operation.kind) {
      case 'addField':
        return operationHandlers.addField.compileSchemaPatch(
          operation,
          context,
        );
      case 'removeField':
        return operationHandlers.removeField.compileSchemaPatch(
          operation,
          context,
        );
      case 'renameField':
        return operationHandlers.renameField.compileSchemaPatch(
          operation,
          context,
        );
      case 'replaceField':
        return operationHandlers.replaceField.compileSchemaPatch(
          operation,
          context,
        );
      case 'splitField':
        return operationHandlers.splitField.compileSchemaPatch(
          operation,
          context,
        );
      case 'mergeFields':
        return operationHandlers.mergeFields.compileSchemaPatch(
          operation,
          context,
        );
      case 'customTransform':
        return operationHandlers.customTransform.compileSchemaPatch(
          operation,
          context,
        );
      default:
        return unsupportedVersioningOperationKind(
          (operation as { kind: string }).kind,
        );
    }
  }

  private async applyRequestOperation(
    operation: RequestOperation,
    container: Record<string, unknown>,
  ): Promise<void> {
    switch (operation.kind) {
      case 'addField':
        await operationHandlers.addField.applyRequest(operation, container);
        return;
      case 'removeField':
        await operationHandlers.removeField.applyRequest(operation, container);
        return;
      case 'renameField':
        await operationHandlers.renameField.applyRequest(operation, container);
        return;
      case 'replaceField':
        await operationHandlers.replaceField.applyRequest(operation, container);
        return;
      case 'splitField':
        await operationHandlers.splitField.applyRequest(operation, container);
        return;
      case 'mergeFields':
        await operationHandlers.mergeFields.applyRequest(operation, container);
        return;
      case 'customTransform':
        await operationHandlers.customTransform.applyRequest(
          operation,
          container,
        );
        return;
      default:
        return unsupportedVersioningOperationKind(
          (operation as { kind: string }).kind,
        );
    }
  }

  private async applyResponseOperation(
    operation: ResponseOperation,
    container: Record<string, unknown>,
  ): Promise<void> {
    switch (operation.kind) {
      case 'addField':
        await operationHandlers.addField.applyResponse(operation, container);
        return;
      case 'removeField':
        await operationHandlers.removeField.applyResponse(operation, container);
        return;
      case 'renameField':
        await operationHandlers.renameField.applyResponse(operation, container);
        return;
      case 'replaceField':
        await operationHandlers.replaceField.applyResponse(
          operation,
          container,
        );
        return;
      case 'splitField':
        await operationHandlers.splitField.applyResponse(operation, container);
        return;
      case 'mergeFields':
        await operationHandlers.mergeFields.applyResponse(operation, container);
        return;
      case 'customTransform':
        await operationHandlers.customTransform.applyResponse(
          operation,
          container,
        );
        return;
      default:
        return unsupportedVersioningOperationKind(
          (operation as { kind: string }).kind,
        );
    }
  }

  private createSchemaCompilationContext(change: Change, payloadPath: string) {
    return {
      payloadPath,
      normalizeSchema: (schema: z.ZodTypeAny) =>
        this.normalizeSchema(change, schema),
      normalizeSchemaMap: (schemas: Readonly<Record<string, z.ZodTypeAny>>) =>
        this.normalizeSchemaMap(change, schemas),
    };
  }

  private readChangeSourceFilePath(change: Change): string | undefined {
    const sourceFilePath = (change as { sourceFilePath?: unknown })
      .sourceFilePath;
    return typeof sourceFilePath === 'string' &&
      sourceFilePath.trim().length > 0
      ? sourceFilePath
      : undefined;
  }

  private normalizeSchemaMap(
    change: Change,
    schemas: Readonly<Record<string, z.ZodTypeAny>>,
  ): Readonly<Record<string, FieldSpec>> {
    const nextSet: Record<string, FieldSpec> = {};
    for (const [field, schema] of Object.entries(schemas)) {
      nextSet[field] = this.normalizeSchema(change, schema);
    }
    return nextSet;
  }

  private normalizeSchema(change: Change, schema: z.ZodTypeAny): FieldSpec {
    const existingExpression = readZodSchemaExpression(schema);
    if (existingExpression) {
      return { zod: schema };
    }

    const extractedExpression =
      readStringProperty(change, 'schemaExpression') ??
      extractAssignedPropertyExpression(change.constructor, 'schema');

    if (!extractedExpression) {
      return { zod: schema };
    }

    return {
      zod: annotateZodSchemaExpression(schema, extractedExpression),
    };
  }
}

function unsupportedVersioningOperationKind(kind: string): never {
  throw new Error(`Unsupported versioning operation kind: ${kind}.`);
}
