import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { DowngradePipeline, UpgradePipeline } from "./versioning-engine";

const API_VERSION_HEADER = "x-api-version";
const API_VERSION_QUERY_PARAM = "api-version";

@Injectable()
export class ApiVersionInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly upgradePipeline: UpgradePipeline,
    private readonly downgradePipeline: DowngradePipeline
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<unknown>> {
    const resources = this.reflector.getAllAndOverride<
      VersionedResourcesMetadata | undefined
    >(VERSIONED_RESOURCES_METADATA, [context.getHandler(), context.getClass()]);

    if (!resources) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const canonicalVersion = this.upgradePipeline.getCanonicalVersion();
    const clientVersion = this.readClientVersion(request) ?? canonicalVersion;

    if (!this.upgradePipeline.isVersionSupported(clientVersion)) {
      throw new BadRequestException(`Unsupported API version ${clientVersion}`);
    }

    if (resources.request && clientVersion !== canonicalVersion) {
      request.body = await this.upgradePipeline.apply({
        fromVersion: clientVersion,
        payload: request.body,
        resourceName: resources.request,
        toVersion: canonicalVersion,
      });
    }

    return next.handle().pipe(
      mergeMap(async (payload) => {
        if (!resources.response || clientVersion === canonicalVersion) {
          return payload;
        }

        return this.downgradePipeline.apply({
          fromVersion: canonicalVersion,
          payload,
          resourceName: resources.response,
          toVersion: clientVersion,
        });
      })
    );
  }

  private readClientVersion(request: FastifyRequest): string | undefined {
    const rawHeader = request.headers[API_VERSION_HEADER];
    const headerVersion = this.normalizeVersion(rawHeader);

    if (headerVersion) {
      return headerVersion;
    }

    const query = request?.query as {
      [API_VERSION_QUERY_PARAM]: string | undefined;
    };
    const rawQueryVersion = headerVersion ?? query?.[API_VERSION_QUERY_PARAM];

    return this.normalizeVersion(rawQueryVersion);
  }

  private normalizeVersion(version: unknown): string | undefined {
    const normalizedVersion = Array.isArray(version) ? version[0] : version;

    return typeof normalizedVersion === "string" && normalizedVersion.trim()
      ? normalizedVersion.trim()
      : undefined;
  }
}

export const VERSIONED_RESOURCES_METADATA = "public-api:versioned-resources";

export interface VersionedResourcesMetadata {
  request?: string;
  response?: string;
}

export const VersionedResources = (metadata: VersionedResourcesMetadata) =>
  SetMetadata(VERSIONED_RESOURCES_METADATA, metadata);
