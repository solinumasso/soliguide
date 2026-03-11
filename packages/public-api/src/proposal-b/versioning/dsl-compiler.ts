/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import { transformContainersAtPath, isRecord } from './object-path.utils';
import type {
  AddFieldOperation,
  CompiledOpenApiPatch,
  CompiledRequestChange,
  CompiledResponseChange,
  CompiledSchemaPatch,
  CompiledVersion,
  CopyFieldOperation,
  FieldSpec,
  MergeFieldsOperation,
  MoveFieldOperation,
  OpenApiPropertyDescriptor,
  RemoveFieldOperation,
  RenameFieldOperation,
  ReplaceFieldOperation,
  RequestCustomTransformOperation,
  RequestOperation,
  RequestVersionChange,
  ResponseCustomTransformOperation,
  ResponseOperation,
  ResponseVersionChange,
  SplitFieldOperation,
  Version,
  VersionTransformContext,
} from './versioning.types';

const DEFAULT_PATH = '/';

function toOpenApiSet(
  set?: Readonly<Record<string, FieldSpec>>,
): Readonly<Record<string, OpenApiPropertyDescriptor>> | undefined {
  if (!set || Object.keys(set).length === 0) {
    return undefined;
  }

  const result: Record<string, OpenApiPropertyDescriptor> = {};
  for (const [field, spec] of Object.entries(set)) {
    result[field] = spec.openApi;
  }

  return result;
}

function setFromEntries(
  entries: Readonly<Record<string, FieldSpec>>,
): Readonly<Record<string, FieldSpec>> {
  return { ...entries };
}

function removeKey(target: Record<string, unknown>, key: string): void {
  delete target[key];
}

function removeKeys(
  target: Record<string, unknown>,
  keys: readonly string[],
): void {
  for (const key of keys) {
    removeKey(target, key);
  }
}

function replaceContainer(
  target: Record<string, unknown>,
  replacement: Record<string, unknown>,
): void {
  removeKeys(target, Object.keys(target));

  for (const [key, value] of Object.entries(replacement)) {
    target[key] = value;
  }
}

function mapValue(
  mapper:
    | ((
        value: unknown,
        context: VersionTransformContext,
        container: Record<string, unknown>,
      ) => Promise<unknown> | unknown)
    | undefined,
  value: unknown,
  context: VersionTransformContext,
  container: Record<string, unknown>,
): Promise<unknown> {
  if (!mapper) {
    return Promise.resolve(value);
  }

  return Promise.resolve(mapper(value, context, container));
}

function buildSchemaPatchForOperation(
  operation: RequestOperation | ResponseOperation,
): CompiledSchemaPatch {
  const payloadPath = operation.payloadPath ?? DEFAULT_PATH;

  switch (operation.kind) {
    case 'addField':
      return {
        payloadPath,
        set: {
          [operation.field]: operation.spec,
        },
      };
    case 'removeField':
      return {
        payloadPath,
        remove: [operation.field],
      };
    case 'renameField':
    case 'moveField':
      return {
        payloadPath,
        remove: [operation.from],
        set: {
          [operation.to]: operation.toSpec,
        },
      };
    case 'copyField':
      return {
        payloadPath,
        set: {
          [operation.to]: operation.toSpec,
        },
      };
    case 'replaceField':
      return {
        payloadPath,
        set: {
          [operation.field]: operation.spec,
        },
      };
    case 'splitField': {
      const remove = operation.removeSource === false ? [] : [operation.from];
      return {
        payloadPath,
        remove,
        set: setFromEntries(operation.into),
      };
    }
    case 'mergeFields': {
      const remove = operation.removeSources === false ? [] : operation.from;
      return {
        payloadPath,
        remove,
        set: {
          [operation.to]: operation.toSpec,
        },
      };
    }
    case 'customTransform':
      return {
        payloadPath,
        remove: operation.schemaPatch?.remove,
        set: operation.schemaPatch?.set,
      };
    default:
      return {
        payloadPath,
      };
  }
}

function buildOpenApiPatchForOperation(
  operation: RequestOperation | ResponseOperation,
): CompiledOpenApiPatch {
  const objectPath = operation.openApiPath ?? DEFAULT_PATH;

  switch (operation.kind) {
    case 'addField':
      return {
        objectPath,
        set: {
          [operation.field]: operation.spec.openApi,
        },
      };
    case 'removeField':
      return {
        objectPath,
        remove: [operation.field],
      };
    case 'renameField':
    case 'moveField':
      return {
        objectPath,
        remove: [operation.from],
        set: {
          [operation.to]: operation.toSpec.openApi,
        },
      };
    case 'copyField':
      return {
        objectPath,
        set: {
          [operation.to]: operation.toSpec.openApi,
        },
      };
    case 'replaceField':
      return {
        objectPath,
        set: {
          [operation.field]: operation.spec.openApi,
        },
      };
    case 'splitField': {
      const remove = operation.removeSource === false ? [] : [operation.from];
      return {
        objectPath,
        remove,
        set: toOpenApiSet(operation.into),
      };
    }
    case 'mergeFields': {
      const remove = operation.removeSources === false ? [] : operation.from;
      return {
        objectPath,
        remove,
        set: {
          [operation.to]: operation.toSpec.openApi,
        },
      };
    }
    case 'customTransform':
      return {
        objectPath,
        remove: operation.schemaPatch?.remove,
        set: toOpenApiSet(operation.schemaPatch?.set),
      };
    default:
      return {
        objectPath,
      };
  }
}

/**
 * `addField` introduces a new field in newer versions while preserving old payloads.
 * Use it when a new property must exist in canonical payloads and can be synthesized.
 * Compatibility note: upgrade sets the field only when missing; downgrade always removes it.
 *
 * ```ts
 * {
 *   kind: 'addField',
 *   field: 'subtitle',
 *   spec: fieldSpec,
 *   buildValue: () => null,
 * }
 * ```
 */
async function upgradeAddField(
  operation: AddFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (operation.field in container) {
    return;
  }

  if (!operation.buildValue) {
    return;
  }

  container[operation.field] = await operation.buildValue(context, container);
}

async function downgradeAddField(
  operation: AddFieldOperation,
  container: Record<string, unknown>,
): Promise<void> {
  removeKey(container, operation.field);
}

/**
 * `removeField` drops a field in newer versions.
 * Use it when canonical payloads no longer expose a legacy property.
 * Compatibility note: upgrade removes the field; downgrade may restore it when `restoreValue` is provided.
 *
 * ```ts
 * {
 *   kind: 'removeField',
 *   field: 'legacyCode',
 *   restoreValue: () => 'N/A',
 * }
 * ```
 */
async function upgradeRemoveField(
  operation: RemoveFieldOperation,
  container: Record<string, unknown>,
): Promise<void> {
  removeKey(container, operation.field);
}

async function downgradeRemoveField(
  operation: RemoveFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (operation.field in container || !operation.restoreValue) {
    return;
  }

  container[operation.field] = await operation.restoreValue(context, container);
}

/**
 * `renameField` changes a key while keeping the semantic value.
 * Use it when a field name changes and both runtime and schema must reflect the new key.
 * Compatibility note: upgrade maps `from -> to`; downgrade maps `to -> from`.
 *
 * ```ts
 * {
 *   kind: 'renameField',
 *   from: 'publishedAt',
 *   to: 'publicationDate',
 *   toSpec: fieldSpec,
 * }
 * ```
 */
async function upgradeRenameField(
  operation: RenameFieldOperation | MoveFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (!(operation.from in container)) {
    return;
  }

  if (!(operation.to in container)) {
    container[operation.to] = await mapValue(
      operation.mapValue,
      container[operation.from],
      context,
      container,
    );
  }

  removeKey(container, operation.from);
}

async function downgradeRenameField(
  operation: RenameFieldOperation | MoveFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (!(operation.to in container)) {
    return;
  }

  if (!(operation.from in container)) {
    container[operation.from] = await mapValue(
      operation.downgradeValue,
      container[operation.to],
      context,
      container,
    );
  }

  removeKey(container, operation.to);
}

/**
 * `copyField` duplicates a value from one key to another in newer versions.
 * Use it when you need temporary parallel fields during migration.
 * Compatibility note: upgrade keeps both keys; downgrade removes the copied target key.
 *
 * ```ts
 * {
 *   kind: 'copyField',
 *   from: 'author',
 *   to: 'primaryAuthor',
 *   toSpec: fieldSpec,
 * }
 * ```
 */
async function upgradeCopyField(
  operation: CopyFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (!(operation.from in container) || operation.to in container) {
    return;
  }

  container[operation.to] = await mapValue(
    operation.mapValue,
    container[operation.from],
    context,
    container,
  );
}

async function downgradeCopyField(
  operation: CopyFieldOperation,
  container: Record<string, unknown>,
): Promise<void> {
  removeKey(container, operation.to);
}

/**
 * `moveField` relocates a value from one key to another.
 * Use it when the old key should not exist anymore in canonical payloads.
 * Compatibility note: it follows the same runtime behavior as `renameField`.
 *
 * ```ts
 * {
 *   kind: 'moveField',
 *   from: 'legacyLocation',
 *   to: 'location',
 *   toSpec: fieldSpec,
 * }
 * ```
 */
async function upgradeMoveField(
  operation: MoveFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  await upgradeRenameField(operation, container, context);
}

async function downgradeMoveField(
  operation: MoveFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  await downgradeRenameField(operation, container, context);
}

/**
 * `replaceField` keeps the same key but changes the value contract.
 * Use it when a field's shape/format evolves (for example string -> object).
 * Compatibility note: upgrade requires `mapValue`; downgrade can provide `downgradeValue`.
 *
 * ```ts
 * {
 *   kind: 'replaceField',
 *   field: 'author',
 *   spec: fieldSpec,
 *   mapValue: (value) => ({ name: String(value) }),
 * }
 * ```
 */
async function upgradeReplaceField(
  operation: ReplaceFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  container[operation.field] = await operation.mapValue(
    container[operation.field],
    context,
    container,
  );
}

async function downgradeReplaceField(
  operation: ReplaceFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (!operation.downgradeValue) {
    return;
  }

  container[operation.field] = await operation.downgradeValue(
    container[operation.field],
    context,
    container,
  );
}

/**
 * `splitField` expands one source field into multiple destination fields.
 * Use it when one legacy value must become several normalized fields.
 * Compatibility note: upgrade can remove source (`removeSource` default true); downgrade needs `merge` to reconstruct source.
 *
 * ```ts
 * {
 *   kind: 'splitField',
 *   from: 'fullName',
 *   into: { firstName: firstSpec, lastName: lastSpec },
 *   split: (value) => {
 *     const [firstName, lastName] = String(value).split(' ');
 *     return { firstName, lastName };
 *   },
 *   merge: ({ firstName, lastName }) => `${firstName} ${lastName}`,
 * }
 * ```
 */
async function upgradeSplitField(
  operation: SplitFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (!(operation.from in container)) {
    return;
  }

  const splitResult = await operation.split(
    container[operation.from],
    context,
    container,
  );

  for (const [field, value] of Object.entries(splitResult)) {
    container[field] = value;
  }

  if (operation.removeSource !== false) {
    removeKey(container, operation.from);
  }
}

async function downgradeSplitField(
  operation: SplitFieldOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (!operation.merge) {
    return;
  }

  const values = Object.keys(operation.into).reduce<Record<string, unknown>>(
    (accumulator, field) => {
      accumulator[field] = container[field];
      return accumulator;
    },
    {},
  );

  container[operation.from] = await operation.merge(values, context, container);
  removeKeys(container, Object.keys(operation.into));
}

/**
 * `mergeFields` combines multiple source fields into one destination field.
 * Use it when canonical model collapses legacy fields into a single structure.
 * Compatibility note: upgrade can remove sources (`removeSources` default true); downgrade needs `split` to restore fields.
 *
 * ```ts
 * {
 *   kind: 'mergeFields',
 *   from: ['city', 'country'],
 *   to: 'location',
 *   toSpec: fieldSpec,
 *   merge: ({ city, country }) => ({ city, country }),
 *   split: (value) => value as Record<string, unknown>,
 * }
 * ```
 */
async function upgradeMergeFields(
  operation: MergeFieldsOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
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

  container[operation.to] = await operation.merge(values, context, container);

  if (operation.removeSources !== false) {
    removeKeys(container, operation.from);
  }
}

async function downgradeMergeFields(
  operation: MergeFieldsOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  if (!(operation.to in container) || !operation.split) {
    return;
  }

  const splitResult = await operation.split(
    container[operation.to],
    context,
    container,
  );

  for (const [field, value] of Object.entries(splitResult)) {
    container[field] = value;
  }

  removeKey(container, operation.to);
}

/**
 * `customTransform` applies a bespoke container-level transformation.
 * Use it for migrations that cannot be expressed with field-level operations.
 * Compatibility note: request side requires `upgrade`; response side requires `downgrade`.
 *
 * ```ts
 * {
 *   kind: 'customTransform',
 *   schemaPatch: {
 *     set: { normalized: normalizedSpec },
 *     remove: ['legacyA', 'legacyB'],
 *   },
 *   upgrade: (container) => ({
 *     ...container,
 *     normalized: `${container.legacyA}:${container.legacyB}`,
 *   }),
 * }
 * ```
 */
async function upgradeCustomTransform(
  operation: RequestCustomTransformOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  const result = await operation.upgrade(container, context);
  if (isRecord(result)) {
    replaceContainer(container, result);
  }
}

async function downgradeCustomTransform(
  operation: ResponseCustomTransformOperation,
  container: Record<string, unknown>,
  context: VersionTransformContext,
): Promise<void> {
  const result = await operation.downgrade(container, context);
  if (isRecord(result)) {
    replaceContainer(container, result);
  }
}

function compileRequestUpgrade(operation: RequestOperation) {
  const payloadPath = operation.payloadPath ?? DEFAULT_PATH;

  return async (
    payload: unknown,
    context: VersionTransformContext,
  ): Promise<unknown> => {
    return transformContainersAtPath(
      payload,
      payloadPath,
      async (container) => {
        switch (operation.kind) {
          case 'addField':
            await upgradeAddField(operation, container, context);
            return;
          case 'removeField':
            await upgradeRemoveField(operation, container);
            return;
          case 'renameField':
            await upgradeRenameField(operation, container, context);
            return;
          case 'copyField':
            await upgradeCopyField(operation, container, context);
            return;
          case 'moveField':
            await upgradeMoveField(operation, container, context);
            return;
          case 'replaceField':
            await upgradeReplaceField(operation, container, context);
            return;
          case 'splitField':
            await upgradeSplitField(operation, container, context);
            return;
          case 'mergeFields':
            await upgradeMergeFields(operation, container, context);
            return;
          case 'customTransform':
            await upgradeCustomTransform(operation, container, context);
            return;
        }
      },
    );
  };
}

function compileResponseDowngrade(operation: ResponseOperation) {
  const payloadPath = operation.payloadPath ?? DEFAULT_PATH;

  return async (
    payload: unknown,
    context: VersionTransformContext,
  ): Promise<unknown> => {
    return transformContainersAtPath(
      payload,
      payloadPath,
      async (container) => {
        switch (operation.kind) {
          case 'addField':
            await downgradeAddField(operation, container);
            return;
          case 'removeField':
            await downgradeRemoveField(operation, container, context);
            return;
          case 'renameField':
            await downgradeRenameField(operation, container, context);
            return;
          case 'copyField':
            await downgradeCopyField(operation, container);
            return;
          case 'moveField':
            await downgradeMoveField(operation, container, context);
            return;
          case 'replaceField':
            await downgradeReplaceField(operation, container, context);
            return;
          case 'splitField':
            await downgradeSplitField(operation, container, context);
            return;
          case 'mergeFields':
            await downgradeMergeFields(operation, container, context);
            return;
          case 'customTransform':
            await downgradeCustomTransform(operation, container, context);
            return;
        }
      },
    );
  };
}

@Injectable()
export class DslCompiler {
  compileRequestChange(change: RequestVersionChange): CompiledRequestChange {
    return {
      description: change.description,
      schemaPatch: buildSchemaPatchForOperation(change.operation),
      openApiPatch: buildOpenApiPatchForOperation(change.operation),
      upgrade: compileRequestUpgrade(change.operation),
    };
  }

  compileResponseChange(change: ResponseVersionChange): CompiledResponseChange {
    return {
      description: change.description,
      schemaPatch: buildSchemaPatchForOperation(change.operation),
      openApiPatch: buildOpenApiPatchForOperation(change.operation),
      downgrade: compileResponseDowngrade(change.operation),
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
}
