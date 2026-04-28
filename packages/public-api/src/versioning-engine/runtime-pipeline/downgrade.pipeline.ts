import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import type {
  VersionContextProviderToken,
  VersionedResourceDefinition,
} from "../dsl";
import { applyDowngradeChanges } from "./transformers";
import { VersionPathResolver } from "./version-path.resolver";
import {
  VersionContextInput,
  VersionContextProvider,
} from "../dsl/version-definition";

export interface DowngradePipelineInput {
  payload: unknown;
  resourceName: string;
  fromVersion?: string;
  toVersion: string;
}

@Injectable()
export class DowngradePipeline {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly versionPathResolver: VersionPathResolver
  ) {}

  public async apply(input: DowngradePipelineInput): Promise<unknown> {
    const fromVersion =
      input.fromVersion ?? this.versionPathResolver.getCanonicalVersion();
    const path = this.versionPathResolver.resolveDowngradePath(
      fromVersion,
      input.toVersion
    );
    let payload = input.payload;

    for (const segment of path) {
      const resource = segment.definition.resources.find(
        (candidate) =>
          candidate.resourceName === input.resourceName &&
          candidate.kind === "response"
      );

      if (!resource) {
        continue;
      }

      const context = await this.getContext(resource, {
        fromVersion: segment.toVersion,
        payload,
        resourceName: input.resourceName,
        toVersion: segment.fromVersion,
      });

      payload = await applyDowngradeChanges(payload, resource.changes, context);
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

    if (typeof token !== "function") {
      return this.moduleRef
        .get<VersionContextProvider<unknown>>(
          token as VersionContextProviderToken,
          { strict: false }
        )
        .getContext(input);
    }

    const provider = await this.moduleRef.create<
      VersionContextProvider<unknown>
    >(token);

    return provider.getContext(input);
  }
}
