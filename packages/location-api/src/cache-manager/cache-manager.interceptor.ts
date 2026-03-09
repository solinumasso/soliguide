/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { slugString } from "@soliguide/common";
import { Observable, tap } from "rxjs";
import { CacheManagerService } from "./services/cache-manager.service";
import { CACHE_PREFIX_KEY } from "./use-cache-manager.decorator";

@Injectable()
export class CacheManagerInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheManager: CacheManagerService,
    private readonly reflector: Reflector
  ) {}

  private getExpectedKeys(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest();

    return Object.entries({
      ...request.params,
      ...request.query,
    })
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, value]) => value !== null && (value as string)?.length
      )
      .map(
        ([key, value]) =>
          `${key}:${this.slugCacheKey(value as unknown as string)}`
      )
      .join(":");
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Check if cache key is here
    const cacheOptions = this.reflector.get(
      CACHE_PREFIX_KEY,
      context.getHandler()
    );

    if (!cacheOptions) {
      return next.handle();
    }

    const { prefix, conditionalParam } = cacheOptions;

    const forceRefresh = request.query.refresh === "true";

    let cacheKey: string;

    if (conditionalParam) {
      const paramValue = request.params[conditionalParam];
      if (!paramValue) {
        return next.handle();
      }
      cacheKey = `${prefix}:${conditionalParam}-${this.slugCacheKey(
        paramValue
      )}`;
    } else {
      // We use all params
      const keyParams = this.getExpectedKeys(context);
      cacheKey = prefix ? `${prefix}:${keyParams}` : keyParams;
    }

    const cachedData = await this.cacheManager.getCachedData(cacheKey);
    if (cachedData && !forceRefresh) {
      return new Observable((subscriber) => {
        subscriber.next(cachedData);
        subscriber.complete();
      });
    }

    return next.handle().pipe(
      tap(async (response) => {
        await this.cacheManager.setCachedData(cacheKey, response);
      })
    );
  }

  private slugCacheKey(key: string): string {
    return slugString(key).replace(/\s+/g, "-").substring(0, 250);
  }
}
