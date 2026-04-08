import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { from, type Observable, switchMap } from 'rxjs';
import { VersioningEngine } from '../../api-versioning/runtime';

type RequestHeaders = Readonly<
  Record<string, string | readonly string[] | undefined>
>;

interface HttpRequestContext {
  body: unknown;
  headers?: RequestHeaders;
}

@Injectable()
export class ApiVersioningInterceptor implements NestInterceptor {
  constructor(private readonly versioningEngine: VersioningEngine) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<HttpRequestContext>();
    const versionHeader = this.extractVersionHeader(
      request.headers?.['x-api-version'],
    );

    request.body = await this.versioningEngine.upgradeRequest(
      request.body,
      versionHeader,
    );

    return next
      .handle()
      .pipe(
        switchMap((responsePayload) =>
          from(
            this.versioningEngine.downgradeResponse(
              responsePayload,
              versionHeader,
            ),
          ),
        ),
      );
  }

  private extractVersionHeader(
    value: string | readonly string[] | undefined,
  ): string | undefined {
    if (typeof value === 'string') {
      return value.trim().length > 0 ? value : undefined;
    }

    if (!value || value.length === 0) {
      return undefined;
    }

    const firstHeaderValue = value[0];
    return firstHeaderValue.trim().length > 0 ? firstHeaderValue : undefined;
  }
}
