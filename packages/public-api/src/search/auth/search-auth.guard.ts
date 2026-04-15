import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { UserStatus } from "@soliguide/common";

import { SearchAuthResolver, SearchUserContext } from "./search-auth.resolver";

type SearchRequest = {
  headers?: Record<string, string | string[] | undefined>;
  get?: (headerName: string) => string | undefined;
  searchUser?: SearchUserContext;
};

const SOLIGUIDE_HOSTNAME_REGEXP =
  /^(.+\.)?((soliguide\.(fr|dev))|(soliguia(\.(ad|es|eu|cat|dev))+))$/;

@Injectable()
export class SearchAuthGuard implements CanActivate {
  constructor(private readonly searchAuthResolver: SearchAuthResolver) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<SearchRequest>();
    const resolvedAuth = await this.searchAuthResolver.resolve(
      this.readHeader(request, "authorization")
    );

    if (
      resolvedAuth.user.status === UserStatus.API_USER &&
      resolvedAuth.blocked
    ) {
      throw new ForbiddenException({ message: "FORBIDDEN_ACCESS" });
    }

    if (!this.isOriginAllowed(request, resolvedAuth.user.status)) {
      throw new ForbiddenException({ message: "FORBIDDEN_API_USER" });
    }

    request.searchUser = resolvedAuth.user;

    return true;
  }

  private isOriginAllowed(request: SearchRequest, userStatus: string): boolean {
    if (this.isMobileHeader(request)) {
      return true;
    }

    if (userStatus === UserStatus.API_USER) {
      return true;
    }

    const env = process.env.ENV ?? "dev";
    if (env === "dev") {
      return true;
    }

    const origin = this.handleOrigin(request);
    if (!origin) {
      return env === "test";
    }

    try {
      const parsedOrigin = new URL(origin);
      const hostname = parsedOrigin.hostname;

      if (hostname === "solinum.org") {
        return true;
      }

      if (hostname === this.extractHostname(this.widgetUrl())) {
        return true;
      }

      const allowedFrontHostnames = this.frontUrls()
        .map((url) => this.extractHostname(url))
        .filter(Boolean);
      if (allowedFrontHostnames.includes(hostname)) {
        return true;
      }

      const allowedWebappHostnames = this.webappUrls()
        .map((url) => this.extractHostname(url))
        .filter(Boolean);
      if (allowedWebappHostnames.includes(hostname)) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  private isMobileHeader(request: SearchRequest): boolean {
    const userAgent = this.readHeader(request, "user-agent");

    return (
      !!userAgent?.startsWith("Soliguide Webview App") ||
      !!userAgent?.startsWith("Soliguide WebApp")
    );
  }

  private handleOrigin(request: SearchRequest): string | null {
    const referer = this.handleReferer(request);
    const cleanedReferer = this.cleanUrl(referer);
    if (cleanedReferer) {
      try {
        const refererUrl = new URL(cleanedReferer);
        if (SOLIGUIDE_HOSTNAME_REGEXP.test(refererUrl.origin)) {
          return refererUrl.origin;
        }
      } catch {
        // noop
      }
    }

    return this.cleanUrl(this.readHeader(request, "origin"));
  }

  private handleReferer(request: SearchRequest): string | undefined {
    return (
      this.readHeader(request, "x-document-referrer") ??
      this.readHeader(request, "referer")
    );
  }

  private cleanUrl(url?: string): string {
    if (!url) {
      return "";
    }

    let cleanedUrl = url.trim();
    cleanedUrl = cleanedUrl.replace(/^https?:\/\/(https?:\/\/)/, "$1");

    if (cleanedUrl.startsWith("http://")) {
      cleanedUrl = cleanedUrl.replace("http://", "https://");
    } else if (!cleanedUrl.startsWith("https://")) {
      cleanedUrl = `https://${cleanedUrl}`;
    }

    return cleanedUrl
      .replace(/\/+$/, "")
      .replace(/(https:\/\/)\/+/g, "$1")
      .replace(/\s+/g, "");
  }

  private frontUrls(): string[] {
    return [
      process.env.SOLIGUIA_AD_URL ?? "http://localhost:4220",
      process.env.SOLIGUIA_ES_URL ?? "http://localhost:4210",
      process.env.SOLIGUIDE_FR_URL ?? "http://localhost:4200",
    ];
  }

  private webappUrls(): string[] {
    return [
      process.env.WEBAPP_FR_URL ?? "http://localhost:5173",
      process.env.WEBAPP_ES_URL ?? "http://localhost:5173",
      process.env.WEBAPP_AD_URL ?? "http://localhost:5173",
    ];
  }

  private widgetUrl(): string {
    return process.env.WIDGET_URL ?? "http://localhost:4201";
  }

  private extractHostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  }

  private readHeader(request: SearchRequest, headerName: string): string {
    const headerValueFromGetter = request.get?.(headerName);
    if (typeof headerValueFromGetter === "string") {
      return headerValueFromGetter;
    }

    const rawHeaderValue = request.headers?.[headerName];
    if (Array.isArray(rawHeaderValue)) {
      return rawHeaderValue[0] ?? "";
    }

    return typeof rawHeaderValue === "string" ? rawHeaderValue : "";
  }
}
