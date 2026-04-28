import { Inject, Injectable } from "@nestjs/common";

import type { ResourceKind, VersionDefinition } from "../dsl";

export const VERSION_DEFINITIONS = Symbol("VERSION_DEFINITIONS");

export interface VersionPathSegment {
  definition: VersionDefinition;
  fromVersion: string;
  toVersion: string;
}

@Injectable()
export class VersionPathResolver {
  private readonly supportedVersions: Set<string>;
  private readonly canonicalVersion: string;

  constructor(
    @Inject(VERSION_DEFINITIONS)
    private readonly definitions: VersionDefinition[]
  ) {
    const versions = this.definitions.flatMap((definition) => [
      definition.baseVersion,
      definition.version,
    ]);

    this.supportedVersions = new Set(versions);
    this.canonicalVersion = versions.sort().at(-1) ?? "";
  }

  public getCanonicalVersion(): string {
    return this.canonicalVersion;
  }

  public isVersionSupported(version: string): boolean {
    return this.supportedVersions.has(version);
  }

  public resolveUpgradePath(
    fromVersion: string,
    toVersion: string = this.canonicalVersion
  ): VersionPathSegment[] {
    if (fromVersion === toVersion) {
      return [];
    }

    const queue: Array<{ version: string; path: VersionPathSegment[] }> = [
      { path: [], version: fromVersion },
    ];
    const visited = new Set<string>([fromVersion]);

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) {
        break;
      }

      for (const definition of this.definitions) {
        if (definition.baseVersion !== current.version) {
          continue;
        }

        if (visited.has(definition.version)) {
          continue;
        }

        const nextPath = [
          ...current.path,
          {
            definition,
            fromVersion: definition.baseVersion,
            toVersion: definition.version,
          },
        ];

        if (definition.version === toVersion) {
          return nextPath;
        }

        visited.add(definition.version);
        queue.push({ path: nextPath, version: definition.version });
      }
    }

    throw new Error(
      `Missing API version path from ${fromVersion} to ${toVersion}`
    );
  }

  resolveDowngradePath(
    fromVersion: string,
    toVersion: string
  ): VersionPathSegment[] {
    return this.resolveUpgradePath(toVersion, fromVersion).reverse();
  }

  hasResource(
    definition: VersionDefinition,
    resourceName: string,
    kind: ResourceKind
  ): boolean {
    return definition.resources.some(
      (resource) =>
        resource.resourceName === resourceName && resource.kind === kind
    );
  }
}
