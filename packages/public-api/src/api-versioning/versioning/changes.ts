import { z } from 'zod';
import type {
  FieldSpec,
  OpenApiObjectPath,
  OpenApiPropertyDescriptor,
  PayloadObjectPath,
  RenameFieldOperation,
  ReplaceFieldOperation,
  RequestOperation,
  RequestVersionChange,
  ResponseOperation,
  ResponseVersionChange,
  Version,
} from './versioning.types';

type MaybeAsync<T = unknown> = Promise<T> | T;
type FieldKey<TContainer> = Extract<keyof TContainer, string>;

export abstract class RequestChange<
  TOperation extends RequestOperation<unknown, unknown>,
> {
  abstract description: string;

  protected abstract buildOperation(): TOperation;

  toChange(): RequestVersionChange {
    return {
      description: this.description,
      operation: this.buildOperation(),
    };
  }
}

export abstract class ResponseChange<TOperation extends ResponseOperation> {
  abstract description: string;

  protected abstract buildOperation(): TOperation;

  toChange(): ResponseVersionChange {
    return {
      description: this.description,
      operation: this.buildOperation(),
    };
  }
}

export abstract class RenameFieldRequestChange<
  TPayload = unknown,
  TOpenApiSchema = unknown,
  TContainer extends Record<string, unknown> = TPayload extends Record<
    string,
    unknown
  >
    ? TPayload
    : Record<string, unknown>,
> extends RequestChange<RenameFieldOperation> {
  abstract from: FieldKey<TContainer>;
  abstract to: string;
  payloadPath: PayloadObjectPath<TPayload> = '/';
  openApiPath: OpenApiObjectPath<TOpenApiSchema> = '/';

  protected abstract getZodSchema(): z.ZodTypeAny;
  protected abstract getOpenApiProperty(): OpenApiPropertyDescriptor;

  protected upgradeValueMapper(
    value: unknown,
    _container: Record<string, unknown>,
  ): MaybeAsync<unknown> {
    return value;
  }

  protected toFieldSpec(): FieldSpec {
    return {
      zod: this.getZodSchema(),
      openApi: this.getOpenApiProperty(),
    };
  }

  protected override buildOperation(): RenameFieldOperation {
    return {
      kind: 'renameField',
      from: this.from,
      to: this.to,
      payloadPath: this.payloadPath,
      openApiPath: this.openApiPath,
      toSpec: this.toFieldSpec(),
      mapValue: (value, container) => this.upgradeValueMapper(value, container),
    };
  }
}

export abstract class RenameFieldResponseChange<
  TPayload = unknown,
  TOpenApiSchema = unknown,
  TContainer extends Record<string, unknown> = TPayload extends Record<
    string,
    unknown
  >
    ? TPayload
    : Record<string, unknown>,
> extends ResponseChange<RenameFieldOperation> {
  abstract from: FieldKey<TContainer>;
  abstract to: string;
  payloadPath: PayloadObjectPath<TPayload> = '/';
  openApiPath: OpenApiObjectPath<TOpenApiSchema> = '/';

  protected abstract getZodSchema(): z.ZodTypeAny;
  protected abstract getOpenApiProperty(): OpenApiPropertyDescriptor;

  protected downgradeValueMapper(
    value: unknown,
    _container: Record<string, unknown>,
  ): MaybeAsync<unknown> {
    return value;
  }

  protected toFieldSpec(): FieldSpec {
    return {
      zod: this.getZodSchema(),
      openApi: this.getOpenApiProperty(),
    };
  }

  protected override buildOperation(): RenameFieldOperation {
    return {
      kind: 'renameField',
      from: this.from,
      to: this.to,
      payloadPath: this.payloadPath,
      openApiPath: this.openApiPath,
      toSpec: this.toFieldSpec(),
      downgradeValue: (value, container) =>
        this.downgradeValueMapper(value, container),
    };
  }
}

export abstract class ReplaceFieldResponseChange<
  TPayload = unknown,
  TOpenApiSchema = unknown,
  TContainer extends Record<string, unknown> = TPayload extends Record<
    string,
    unknown
  >
    ? TPayload
    : Record<string, unknown>,
> extends ResponseChange<ReplaceFieldOperation> {
  abstract field: FieldKey<TContainer>;
  abstract payloadPath: PayloadObjectPath<TPayload>;
  abstract openApiPath: OpenApiObjectPath<TOpenApiSchema>;

  protected abstract getZodSchema(): z.ZodTypeAny;
  protected abstract getOpenApiProperty(): OpenApiPropertyDescriptor;
  protected abstract downgradeValueMapper(
    value: unknown,
    container: Record<string, unknown>,
  ): MaybeAsync<unknown>;

  protected toFieldSpec(): FieldSpec {
    return {
      zod: this.getZodSchema(),
      openApi: this.getOpenApiProperty(),
    };
  }

  protected override buildOperation(): ReplaceFieldOperation {
    return {
      kind: 'replaceField',
      field: this.field,
      payloadPath: this.payloadPath,
      openApiPath: this.openApiPath,
      spec: this.toFieldSpec(),
      mapValue: (value) => value,
      downgradeValue: (value, container) =>
        this.downgradeValueMapper(value, container),
    };
  }
}

export type RequestChangeDefinition<
  TPayload = unknown,
  TOpenApiSchema = unknown,
> = RequestChange<RequestOperation<TPayload, TOpenApiSchema>>;

export type ResponseChangeDefinition<
  TPayload = unknown,
  TOpenApiSchema = unknown,
> = ResponseChange<ResponseOperation<TPayload, TOpenApiSchema>>;

export interface VersionDefinitionInput<
  TRequestPayload = unknown,
  TResponsePayload = unknown,
  TRequestOpenApiSchema = unknown,
  TResponseOpenApiSchema = unknown,
> extends Omit<
  Version<
    TRequestPayload,
    TResponsePayload,
    TRequestOpenApiSchema,
    TResponseOpenApiSchema
  >,
  'requestChanges' | 'responseChanges'
> {
  requestChanges: readonly RequestChangeDefinition<
    TRequestPayload,
    TRequestOpenApiSchema
  >[];
  responseChanges: readonly ResponseChangeDefinition<
    TResponsePayload,
    TResponseOpenApiSchema
  >[];
}

export function materializeRequestChanges(
  changes: readonly RequestChangeDefinition[],
): readonly RequestVersionChange[] {
  return changes.map((change) => change.toChange());
}

export function materializeResponseChanges(
  changes: readonly ResponseChangeDefinition[],
): readonly ResponseVersionChange[] {
  return changes.map((change) => change.toChange());
}

export function defineVersion<
  TRequestPayload = unknown,
  TResponsePayload = unknown,
  TRequestOpenApiSchema = unknown,
  TResponseOpenApiSchema = unknown,
>(
  definition: VersionDefinitionInput<
    TRequestPayload,
    TResponsePayload,
    TRequestOpenApiSchema,
    TResponseOpenApiSchema
  >,
): Version<
  TRequestPayload,
  TResponsePayload,
  TRequestOpenApiSchema,
  TResponseOpenApiSchema
> {
  type DefinedVersion = Version<
    TRequestPayload,
    TResponsePayload,
    TRequestOpenApiSchema,
    TResponseOpenApiSchema
  >;

  return {
    version: definition.version,
    description: definition.description,
    requestChanges: materializeRequestChanges(
      definition.requestChanges,
    ) as DefinedVersion['requestChanges'],
    responseChanges: materializeResponseChanges(
      definition.responseChanges,
    ) as DefinedVersion['responseChanges'],
  };
}
