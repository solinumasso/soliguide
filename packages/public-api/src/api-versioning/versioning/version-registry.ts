import { Injectable } from '@nestjs/common';
import { DslCompiler } from './dsl-compiler';
import { parseObjectPath } from './object-path.utils';
import type {
  ApiVersion,
  CompiledVersion,
  RequestOperation,
  ResponseOperation,
  Version,
  VersioningDefinition,
} from './versioning.types';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertValidDateLiteral(version: string): void {
  if (!DATE_PATTERN.test(version)) {
    throw new Error(`Version "${version}" must follow YYYY-MM-DD format.`);
  }

  const parsed = new Date(`${version}T00:00:00.000Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== version
  ) {
    throw new Error(`Version "${version}" is not a valid calendar date.`);
  }
}

function assertPath(
  objectPath: string | undefined,
  label: string,
  allowWildcard: boolean,
): void {
  try {
    parseObjectPath(objectPath ?? '/', { allowWildcard });
  } catch (error) {
    throw new Error(`${label}: ${(error as Error).message}`);
  }
}

function assertOperationBase(
  operation: RequestOperation | ResponseOperation,
  version: ApiVersion,
  changeDescription: string,
): void {
  assertPath(
    operation.payloadPath,
    `Invalid payloadPath in version ${version} change "${changeDescription}"`,
    true,
  );

  assertPath(
    operation.openApiPath,
    `Invalid openApiPath in version ${version} change "${changeDescription}"`,
    false,
  );
}

function assertNonEmpty(value: string, errorMessage: string): void {
  if (value.trim().length === 0) {
    throw new Error(errorMessage);
  }
}

function touchedResponseFields(operation: ResponseOperation): readonly string[] {
  switch (operation.kind) {
    case 'addField':
    case 'removeField':
    case 'replaceField':
      return [operation.field];
    case 'renameField':
    case 'copyField':
    case 'moveField':
      return [operation.from, operation.to];
    case 'splitField':
      return [operation.from, ...Object.keys(operation.into)];
    case 'mergeFields':
      return [...operation.from, operation.to];
    case 'customTransform':
      return [
        ...(operation.schemaPatch?.remove ?? []),
        ...Object.keys(operation.schemaPatch?.set ?? {}),
      ];
  }
}

function assertNoConflictingResponseChanges(version: Version): void {
  const touchedByPath = new Map<string, string>();

  for (const change of version.responseChanges) {
    const payloadPath = change.operation.payloadPath ?? '/';

    for (const field of touchedResponseFields(change.operation)) {
      const conflictKey = `${payloadPath}::${field}`;
      const previousDescription = touchedByPath.get(conflictKey);

      if (previousDescription) {
        throw new Error(
          `Version ${version.version} has multiple response changes targeting field "${field}" at payloadPath "${payloadPath}" ("${previousDescription}" and "${change.description}"). Consolidate them into a single change.`,
        );
      }

      touchedByPath.set(conflictKey, change.description);
    }
  }
}

function assertRequestOperation(
  operation: RequestOperation,
  version: ApiVersion,
  changeDescription: string,
): void {
  assertOperationBase(operation, version, changeDescription);

  switch (operation.kind) {
    case 'addField':
    case 'removeField':
      assertNonEmpty(
        operation.field,
        `Version ${version} change "${changeDescription}" has an empty field in ${operation.kind}.`,
      );
      return;
    case 'renameField':
    case 'copyField':
    case 'moveField':
      assertNonEmpty(
        operation.from,
        `Version ${version} change "${changeDescription}" has an empty source field in ${operation.kind}.`,
      );
      assertNonEmpty(
        operation.to,
        `Version ${version} change "${changeDescription}" has an empty target field in ${operation.kind}.`,
      );
      return;
    case 'replaceField':
      assertNonEmpty(
        operation.field,
        `Version ${version} change "${changeDescription}" has an empty field in replaceField.`,
      );
      return;
    case 'splitField':
      assertNonEmpty(
        operation.from,
        `Version ${version} change "${changeDescription}" has an empty source field in splitField.`,
      );
      if (Object.keys(operation.into).length === 0) {
        throw new Error(
          `Version ${version} change "${changeDescription}" splitField must define at least one target field.`,
        );
      }
      for (const field of Object.keys(operation.into)) {
        assertNonEmpty(
          field,
          `Version ${version} change "${changeDescription}" has an empty target field in splitField.`,
        );
      }
      return;
    case 'mergeFields':
      if (operation.from.length === 0) {
        throw new Error(
          `Version ${version} change "${changeDescription}" mergeFields must define at least one source field.`,
        );
      }
      assertNonEmpty(
        operation.to,
        `Version ${version} change "${changeDescription}" has an empty target field in mergeFields.`,
      );
      for (const field of operation.from) {
        assertNonEmpty(
          field,
          `Version ${version} change "${changeDescription}" has an empty source field in mergeFields.`,
        );
      }
      return;
    case 'customTransform':
      return;
  }
}

function assertResponseOperation(
  operation: ResponseOperation,
  version: ApiVersion,
  changeDescription: string,
): void {
  assertOperationBase(operation, version, changeDescription);

  switch (operation.kind) {
    case 'addField':
    case 'removeField':
      assertNonEmpty(
        operation.field,
        `Version ${version} change "${changeDescription}" has an empty field in ${operation.kind}.`,
      );
      return;
    case 'renameField':
    case 'copyField':
    case 'moveField':
      assertNonEmpty(
        operation.from,
        `Version ${version} change "${changeDescription}" has an empty source field in ${operation.kind}.`,
      );
      assertNonEmpty(
        operation.to,
        `Version ${version} change "${changeDescription}" has an empty target field in ${operation.kind}.`,
      );
      return;
    case 'replaceField':
      assertNonEmpty(
        operation.field,
        `Version ${version} change "${changeDescription}" has an empty field in replaceField.`,
      );
      if (!operation.downgradeValue) {
        throw new Error(
          `Version ${version} change "${changeDescription}" replaceField must define downgradeValue for response compatibility.`,
        );
      }
      return;
    case 'splitField':
      assertNonEmpty(
        operation.from,
        `Version ${version} change "${changeDescription}" has an empty source field in splitField.`,
      );
      if (Object.keys(operation.into).length === 0) {
        throw new Error(
          `Version ${version} change "${changeDescription}" splitField must define at least one target field.`,
        );
      }
      for (const field of Object.keys(operation.into)) {
        assertNonEmpty(
          field,
          `Version ${version} change "${changeDescription}" has an empty target field in splitField.`,
        );
      }
      if (!operation.merge) {
        throw new Error(
          `Version ${version} change "${changeDescription}" splitField must define merge for response downgrades.`,
        );
      }
      return;
    case 'mergeFields':
      if (operation.from.length === 0) {
        throw new Error(
          `Version ${version} change "${changeDescription}" mergeFields must define at least one source field.`,
        );
      }
      assertNonEmpty(
        operation.to,
        `Version ${version} change "${changeDescription}" has an empty target field in mergeFields.`,
      );
      for (const field of operation.from) {
        assertNonEmpty(
          field,
          `Version ${version} change "${changeDescription}" has an empty source field in mergeFields.`,
        );
      }
      if (!operation.split) {
        throw new Error(
          `Version ${version} change "${changeDescription}" mergeFields must define split for response downgrades.`,
        );
      }
      return;
    case 'customTransform':
      return;
  }
}

@Injectable()
export class VersionRegistry {
  readonly definition: VersioningDefinition;
  readonly versions: readonly Version[];
  readonly compiledVersions: readonly CompiledVersion[];
  readonly supportedVersions: readonly ApiVersion[];
  readonly canonicalVersion: ApiVersion;

  constructor(definition: VersioningDefinition, compiler?: DslCompiler) {
    this.definition = definition;
    this.versions = definition.versions;

    this.validateDefinition();

    this.supportedVersions = this.versions.map((version) => version.version);
    this.canonicalVersion =
      this.supportedVersions[this.supportedVersions.length - 1];

    const dslCompiler = compiler ?? new DslCompiler();
    this.compiledVersions = dslCompiler.compileVersions(this.versions);
  }

  getVersionIndex(version: ApiVersion): number {
    return this.supportedVersions.indexOf(version);
  }

  getVersionByIndex(index: number): Version {
    return this.versions[index];
  }

  getCompiledVersionByIndex(index: number): CompiledVersion {
    return this.compiledVersions[index];
  }

  private validateDefinition(): void {
    if (this.versions.length === 0) {
      throw new Error('At least one API version must be configured.');
    }

    if (!this.definition.baseRequestOpenApiSchema) {
      throw new Error('A baseRequestOpenApiSchema must be configured.');
    }

    if (!this.definition.baseResponseOpenApiSchema) {
      throw new Error('A baseResponseOpenApiSchema must be configured.');
    }

    if (!this.definition.baseRequestSchema) {
      throw new Error('A baseRequestSchema must be configured.');
    }

    if (!this.definition.baseResponseSchema) {
      throw new Error('A baseResponseSchema must be configured.');
    }

    const seenVersions = new Set<string>();
    let previousVersion: string | null = null;

    for (const version of this.versions) {
      assertValidDateLiteral(version.version);

      if (seenVersions.has(version.version)) {
        throw new Error(
          `Duplicate API version detected: "${version.version}".`,
        );
      }

      if (previousVersion && version.version <= previousVersion) {
        throw new Error(
          `API versions must be in strict chronological order. "${version.version}" must be newer than "${previousVersion}".`,
        );
      }

      for (const change of version.requestChanges) {
        if (change.description.trim().length === 0) {
          throw new Error(
            `Version ${version.version} has an empty request change description.`,
          );
        }

        assertRequestOperation(
          change.operation,
          version.version,
          change.description,
        );
      }

      for (const change of version.responseChanges) {
        if (change.description.trim().length === 0) {
          throw new Error(
            `Version ${version.version} has an empty response change description.`,
          );
        }

        assertResponseOperation(
          change.operation,
          version.version,
          change.description,
        );
      }
      assertNoConflictingResponseChanges(version);

      seenVersions.add(version.version);
      previousVersion = version.version;
    }
  }
}
