import { z } from 'zod';
import {
  CompiledSchemaPatch,
  FieldSpec,
  ResponseDowngradeContext,
} from '../../versioning.types';
import { MaybeAsync } from '../../../utils';

export interface SchemaCompilationContext {
  payloadPath: string;
  normalizeSchema(schema: z.ZodTypeAny): FieldSpec;
  normalizeSchemaMap(
    schemas: Readonly<Record<string, z.ZodTypeAny>>,
  ): Readonly<Record<string, FieldSpec>>;
}

export interface OperationHandler<TRequestOperation, TResponseOperation> {
  compileSchemaPatch(
    operation: TRequestOperation | TResponseOperation,
    context: SchemaCompilationContext,
  ): CompiledSchemaPatch;
  applyRequest(
    operation: TRequestOperation,
    container: Record<string, unknown>,
  ): MaybeAsync<void>;
  applyResponse(
    operation: TResponseOperation,
    container: Record<string, unknown>,
    context?: ResponseDowngradeContext,
  ): MaybeAsync<void>;
}
