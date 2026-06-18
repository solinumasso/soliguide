import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import type {
  VersionContextInput,
  VersionContextProvider,
  VersionContextProviderToken,
  VersionedResourceDefinition,
} from "../dsl";
import { applyUpgradeChanges } from "./transformers";
import { VersionPathResolver } from "./version-path.resolver";

export interface UpgradePipelineInput {
  payload: unknown;
  resourceName: string;
  fromVersion: string;
  toVersion?: string;
}

@Injectable()
export class UpgradePipeline {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly versionPathResolver: VersionPathResolver
  ) {}

  getCanonicalVersion(): string {
    return this.versionPathResolver.getCanonicalVersion();
  }

  isVersionSupported(version: string): boolean {
    return this.versionPathResolver.isVersionSupported(version);
  }

  async apply(input: UpgradePipelineInput): Promise<unknown> {
    const toVersion =
      input.toVersion ?? this.versionPathResolver.getCanonicalVersion();
    const path = this.versionPathResolver.resolveUpgradePath(
      input.fromVersion,
      toVersion
    );
    let payload = input.payload;

    for (const segment of path) {
      const resource = segment.definition.resources.find(
        (candidate) =>
          candidate.resourceName === input.resourceName &&
          candidate.kind === "request"
      );

      if (!resource) {
        continue;
      }

      const context = await this.getContext(resource, {
        fromVersion: segment.fromVersion,
        payload,
        resourceName: input.resourceName,
        toVersion: segment.toVersion,
      });

      payload = await applyUpgradeChanges(payload, resource.changes, context);
    }

    return payload;
  }

  private async getContext(
    resource: VersionedResourceDefinition,
    input: VersionContextInput
  ): Promise<unknown> {
    const token = resource.contextProvider;

    if (!token) {
      return undefined;
    }

    return this.moduleRef
      .get<VersionContextProvider<unknown>>(
        token as VersionContextProviderToken,
        { strict: false }
      )
      .getContext(input);
  }
}
