import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { UserStatus, UserStatusNotLogged } from "@soliguide/common";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";

import { SearchAuthGuard } from "./search-auth.guard";
import { SearchAuthResolver } from "./search-auth.resolver";

describe("SearchAuthGuard", () => {
  const resolver: Mocked<SearchAuthResolver> = {
    resolve: vi.fn(),
  } as unknown as Mocked<SearchAuthResolver>;

  const guard = new SearchAuthGuard(resolver);

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ENV = "prod";
    process.env.SOLIGUIDE_FR_URL = "https://soliguide.fr";
    process.env.SOLIGUIA_ES_URL = "https://soliguia.es";
    process.env.SOLIGUIA_AD_URL = "https://soliguia.ad";
    process.env.WEBAPP_FR_URL = "https://app.soliguide.fr";
    process.env.WEBAPP_ES_URL = "https://app.soliguia.es";
    process.env.WEBAPP_AD_URL = "https://app.soliguia.ad";
    process.env.WIDGET_URL = "https://widget.soliguide.fr";
  });

  it("resolves user and attaches it to request", async () => {
    resolver.resolve.mockResolvedValue({
      user: {
        userId: "anonymous",
        status: UserStatusNotLogged.NOT_LOGGED,
      },
      blocked: false,
    });

    const request = buildRequest({
      authorization: "JWT token",
      origin: "https://soliguide.fr",
    });

    await expect(guard.canActivate(buildContext(request))).resolves.toBe(true);

    expect(resolver.resolve).toHaveBeenCalledWith("JWT token");
    expect(request.searchUser).toEqual({
      userId: "anonymous",
      status: UserStatusNotLogged.NOT_LOGGED,
    });
  });

  it("rejects blocked API_USER with FORBIDDEN_ACCESS", async () => {
    resolver.resolve.mockResolvedValue({
      user: {
        userId: "u1",
        status: UserStatus.API_USER,
      },
      blocked: true,
    });

    const request = buildRequest({
      authorization: "JWT token",
    });

    await expect(guard.canActivate(buildContext(request))).rejects.toThrow(
      ForbiddenException
    );

    await expect(
      guard.canActivate(buildContext(request))
    ).rejects.toMatchObject({
      response: { message: "FORBIDDEN_ACCESS" },
    });
  });

  it("rejects non API users when origin is missing/invalid", async () => {
    resolver.resolve.mockResolvedValue({
      user: {
        userId: "u2",
        status: UserStatus.SIMPLE_USER,
      },
      blocked: false,
    });

    const request = buildRequest({
      authorization: "JWT token",
    });

    await expect(
      guard.canActivate(buildContext(request))
    ).rejects.toMatchObject({
      response: { message: "FORBIDDEN_API_USER" },
    });
  });

  it("allows API_USER without origin", async () => {
    resolver.resolve.mockResolvedValue({
      user: {
        userId: "u3",
        status: UserStatus.API_USER,
      },
      blocked: false,
    });

    const request = buildRequest({
      authorization: "JWT token",
    });

    await expect(guard.canActivate(buildContext(request))).resolves.toBe(true);
  });
});

function buildContext(request: any): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as ExecutionContext;
}

function buildRequest(headers: Record<string, string> = {}) {
  const normalizedHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
  );

  return {
    headers: normalizedHeaders,
    get: (headerName: string) => normalizedHeaders[headerName.toLowerCase()],
    searchUser: undefined,
  };
}
