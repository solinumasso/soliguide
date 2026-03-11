import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { SearchResponse20260309DTO } from './search.2026-03-09.dto';
import { SEARCH_RESPONSE_DOWNGRADE_CONFIG } from './search.versioning';
import { VersionMapperService } from './versioning/version-mapper.service';

@Injectable()
export class SearchVersioningInterceptor implements NestInterceptor {
  constructor(private readonly versionMapperService: VersionMapperService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<SearchResponse20260309DTO>,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestedVersion = this.getRequestedVersion(request);

    return next
      .handle()
      .pipe(
        map((response) => this.applyDowngradePath(response, requestedVersion)),
      );
  }

  private getRequestedVersion(request: Request): string | null {
    const headerVersion = request.header('X-API-VERSION');
    if (typeof headerVersion === 'string' && headerVersion.trim().length > 0) {
      return this.normalizeVersion(headerVersion);
    }

    const queryVersion = request.query.apiVersion;
    if (typeof queryVersion === 'string' && queryVersion.trim().length > 0) {
      return this.normalizeVersion(queryVersion);
    }

    if (Array.isArray(queryVersion)) {
      const firstVersion = queryVersion.find(
        (value): value is string =>
          typeof value === 'string' && value.trim().length > 0,
      );

      if (firstVersion) {
        return this.normalizeVersion(firstVersion);
      }
    }

    return null;
  }

  private normalizeVersion(version: string): string {
    return version.trim().replace(/^v/i, '');
  }

  private applyDowngradePath(response: unknown, targetVersion: string | null) {
    return this.versionMapperService.applyDowngradeChain({
      ...SEARCH_RESPONSE_DOWNGRADE_CONFIG,
      targetVersion,
      payload: response,
    });
  }
}
