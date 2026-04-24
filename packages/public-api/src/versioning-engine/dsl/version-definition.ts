import {
  AnyVersionChange,
  assertChangesDoNotConflict,
  assertUniqueResourceNames,
  assertVersionToken,
} from "./version-change";

export interface VersionedResourceDefinition<TSchema = unknown> {
  resourceName: string;
  changes: AnyVersionChange<TSchema>[];
}

export interface VersionDefinition {
  version: string;
  baseVersion: string;
  description?: string;
  resources: VersionedResourceDefinition<any>[];
}

export function resource<TSchema>(
  resourceName: string,
  changes: AnyVersionChange<TSchema>[]
): VersionedResourceDefinition<TSchema> {
  return {
    changes,
    resourceName,
  };
}

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
