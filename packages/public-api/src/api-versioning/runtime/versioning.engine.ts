import { Injectable } from '@nestjs/common';
import { RequestVersioningPipeline } from './request-versioning.pipeline';
import { ResponseVersioningPipeline } from './response-versioning.pipeline';

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
  ): Promise<unknown> {
    return this.responseVersioningPipeline.downgradeResponse(
      output,
      versionHeader,
    );
  }
}
