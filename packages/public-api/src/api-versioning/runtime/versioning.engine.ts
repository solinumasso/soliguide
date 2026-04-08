import { Injectable } from '@nestjs/common';
import { RequestVersioningPipeline } from './request-versioning.pipeline';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';
import type { ResponseDowngradeContext } from '../versioning/versioning.types';

@Injectable()
export class VersioningEngine {
  constructor(
    private readonly requestVersioningPipeline: RequestVersioningPipeline,
    private readonly responseVersioningPipeline: ResponseVersioningPipeline,
  ) {}

  async upgradeRequest(
    input: unknown,
    versionHeader: string | null | undefined,
  ): Promise<unknown> {
    return this.requestVersioningPipeline.upgradeRequest(input, versionHeader);
  }

  async downgradeResponse(
    output: unknown,
    versionHeader: string | null | undefined,
    context?: ResponseDowngradeContext,
  ): Promise<unknown> {
    return this.responseVersioningPipeline.downgradeResponse(
      output,
      versionHeader,
      context,
    );
  }
}
