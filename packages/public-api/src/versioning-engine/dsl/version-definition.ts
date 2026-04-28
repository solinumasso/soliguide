import { ResourceKind } from "./changes/runtime";
import {
  add,
  AnyVersionChange,
  AddChangePayload,
  patch,
  PatchChangePayload,
  remove,
  RemoveChangePayload,
  rename,
  replaceSchema,
  ReplaceSchemaChangePayload,
  VersionChange,
  isPatchGroupPayload,
  ChangeType,
  RenameChangePayload,
} from "./changes/version-change";

type VersionRuntimeMapper<
  TInput = unknown,
  TContext = unknown,
  TOutput = unknown
> = (input: TInput, context: TContext) => TOutput | Promise<TOutput>;

export type VersionContextProviderToken = symbol;

export interface VersionedResourceDefinition<TSchema = unknown> {
  resourceName: string;
  baseVersion?: string;
  kind?: ResourceKind;
  version?: string;
  description?: string;
  contextProvider?: VersionContextProviderToken;
  changes: AnyVersionChange<TSchema>[];
  upgradeRequest?: VersionRuntimeMapper<any, any, any>;
  downgradeResponse?: VersionRuntimeMapper<any, any, any>;
}

export interface VersionContextProvider<TContext = unknown> {
  getContext(input: VersionContextInput): Promise<TContext> | TContext;
}

export type VersionContextInput<TPayload = unknown> = {
  payload: TPayload;
  resourceName: string;
  fromVersion: string;
  toVersion: string;
};

export interface VersionDefinition {
  version: string;
  baseVersion: string;
  description?: string;
  resources: VersionedResourceDefinition<any>[];
}

export type ResourceChangesFactory<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
> = (
  helpers: ResourceChangeHelpers<TSchema, TDirection>
) => AnyVersionChange<TSchema>[];

interface ResourceChangeHelpers<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
> {
  add(
    payload: AddChangePayload<TSchema, TDirection>
  ): VersionChange<TSchema, "add">;
  remove(
    payload: RemoveChangePayload<TSchema, TDirection>
  ): VersionChange<TSchema, "remove">;
  rename(
    payload: RenameChangePayload<TSchema, TDirection>
  ): VersionChange<TSchema, "rename">;
  replaceSchema(
    payload: ReplaceSchemaChangePayload<TSchema, TDirection>
  ): VersionChange<TSchema, "replaceSchema">;
  patch(
    payload: PatchChangePayload<TSchema, TDirection>
  ): VersionChange<TSchema, "patch">;
}

export function resource<
  TSchema = unknown,
  TDirection extends ResourceKind = ResourceKind
>(
  resourceName: string,
  options: ResourceDefinitionOptions<TSchema, TDirection>
): VersionedResourceDefinition<TSchema> {
  const resolvedOptionChanges =
    typeof options.changes === "function"
      ? options.changes(createResourceChangeHelpers<TSchema>())
      : options.changes;

  return {
    baseVersion: options.baseVersion,
    changes: resolvedOptionChanges,
    contextProvider: options.contextProvider,
    description: options.description,
    kind: options.kind,
    resourceName,
    version: options.version,
  };
}

export type ResourceDefinitionOptions<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
> = {
  version?: string;
  baseVersion?: string;
  description?: string;
  kind: TDirection;
  contextProvider?: VersionContextProviderToken;
  changes:
    | AnyVersionChange<TSchema>[]
    | ResourceChangesFactory<TSchema, TDirection>;
};

export function defineVersion<TVersion extends VersionDefinition>(
  definition: TVersion
): TVersion {
  assertVersionToken(definition.version, "version");
  assertVersionToken(definition.baseVersion, "baseVersion");
  assertUniqueResourceNames(
    definition.resources,
    `version ${definition.version}`
  );

  for (const resource of definition.resources) {
    assertChangesDoNotConflict(resource.resourceName, resource.changes);
  }

  return definition;
}

function createResourceChangeHelpers<
  TSchema,
  TDirection extends ResourceKind = ResourceKind
>(): ResourceChangeHelpers<TSchema, TDirection> {
  return {
    add: (payload) => add(payload) as VersionChange<TSchema, "add">,
    patch: (payload) => patch(payload) as VersionChange<TSchema, "patch">,

    remove: (payload) => remove(payload) as VersionChange<TSchema, "remove">,
    rename: (payload) => rename(payload) as VersionChange<TSchema, "rename">,
    replaceSchema: (payload) =>
      replaceSchema(payload) as VersionChange<TSchema, "replaceSchema">,
  };
}

function assertVersionToken(version: string, label: string): void {
  if (!VERSION_REGEX.test(version)) {
    throw new Error(
      `Invalid ${label} "${version}". Expected format YYYY-MM-DD.`
    );
  }
}

const VERSION_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function assertChangesDoNotConflict(
  resourceName: string,
  changes: ChangeWithPaths[]
): void {
  const consumedPaths = new Map<string, string>();
  const producedPaths = new Map<string, string>();

  for (const [index, change] of flattenChangeGroups(changes).entries()) {
    const changeName =
      change.changeName ?? `${resourceName}:${change.type}#${index + 1}`;

    for (const pathKey of getConsumedPaths(change)) {
      const previousChange = consumedPaths.get(pathKey);
      if (previousChange) {
        throw new Error(
          `Conflicting ordered edits for resource ${resourceName} on path ${pathKey}: ${previousChange} and ${changeName}`
        );
      }

      consumedPaths.set(pathKey, changeName);
    }

    for (const pathKey of getProducedPaths(change)) {
      const previousChange = producedPaths.get(pathKey);
      if (previousChange) {
        throw new Error(
          `Conflicting ordered edits for resource ${resourceName} on path ${pathKey}: ${previousChange} and ${changeName}`
        );
      }

      producedPaths.set(pathKey, changeName);
    }
  }
}

function flattenChangeGroups(changes: ChangeWithPaths[]): ChangeWithPaths[] {
  const flattenedChanges: ChangeWithPaths[] = [];

  for (const change of changes) {
    if (isPatchGroupPayload(change.payload)) {
      flattenedChanges.push(...change.payload.changes);
      continue;
    }

    flattenedChanges.push(change);
  }

  return flattenedChanges;
}

function getConsumedPaths(change: ChangeWithPaths): string[] {
  switch (change.type) {
    case "add":
      return [];
    case "remove":
      return [change.payload.payloadPath];
    case "rename":
      return [joinPayloadPath(change.payload.payloadPath, change.payload.from)];
    case "replaceSchema":
      return [];
    case "patch": {
      if (isPatchGroupPayload(change.payload)) {
        return [];
      }

      const action = change.payload.action;

      if (action?.type === "insert") {
        return [joinPayloadPath(change.payload.payloadPath, action.field)];
      }

      if (action?.type === "remove" && action.field) {
        return [joinPayloadPath(change.payload.payloadPath, action.field)];
      }

      if (change.payload.selector?.type === "field") {
        return [
          joinPayloadPath(
            change.payload.payloadPath,
            change.payload.selector.field
          ),
        ];
      }

      return [change.payload.payloadPath];
    }
    default:
      return [];
  }
}

function getProducedPaths(change: ChangeWithPaths): string[] {
  switch (change.type) {
    case "add":
      return [
        joinPayloadPath(change.payload.payloadPath, change.payload.field),
      ];
    case "rename":
      return [joinPayloadPath(change.payload.payloadPath, change.payload.to)];
    case "patch": {
      if (isPatchGroupPayload(change.payload)) {
        return [];
      }

      const action = change.payload.action;

      if (action?.type === "insert") {
        return [joinPayloadPath(change.payload.payloadPath, action.field)];
      }

      return [];
    }
    default:
      return [];
  }
}

type ChangeWithPaths = {
  changeName?: string;
  type: ChangeType;
  payload: any;
};

function joinPayloadPath(payloadPath: string, fieldName: string): string {
  return payloadPath ? `${payloadPath}.${fieldName}` : fieldName;
}

export function assertUniqueResourceNames(
  resources: { resourceName: string }[],
  sourceLabel: string
): void {
  const seenResourceNames = new Set<string>();

  for (const resource of resources) {
    if (seenResourceNames.has(resource.resourceName)) {
      throw new Error(
        `Duplicate resourceName ${resource.resourceName} in ${sourceLabel}`
      );
    }

    seenResourceNames.add(resource.resourceName);
  }
}
