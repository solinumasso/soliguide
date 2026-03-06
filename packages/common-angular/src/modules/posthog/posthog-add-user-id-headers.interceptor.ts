import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, forkJoin } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { PosthogConfig } from "./posthog-config";
import { PosthogService } from "./posthog.service";

@Injectable()
export class PosthogAddUserIdHeadersInterceptor implements HttpInterceptor {
  constructor(
    private readonly posthogConfig: PosthogConfig,
    private readonly posthogService: PosthogService
  ) {}

  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      !this.posthogService.enabled ||
      !req.url.startsWith(this.posthogConfig.soliguideApiUrl)
    ) {
      return next.handle(req);
    }

    return forkJoin({
      userSessionId: this.posthogService.getUserSessionId(),
      userDistinctId: this.posthogService.getUserDistinctId(),
    }).pipe(
      map(({ userSessionId, userDistinctId }) => {
        let headers = req.headers;
        if (userSessionId) {
          headers = headers.append("X-Ph-User-Session-Id", userSessionId);
        }
        if (userDistinctId) {
          headers = headers.append("X-Ph-User-Distinct-Id", userDistinctId);
        }
        return req.clone({ headers });
      }),
      mergeMap((request) => next.handle(request))
    );
  }
}
