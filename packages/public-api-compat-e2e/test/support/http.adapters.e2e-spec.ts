import { UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import {
  LegacyApiSupertestAdapter,
  PublicApiSupertestAdapter,
} from "./http.adapters";
import { PersonaContext } from "./compatibility.types";

describe("compatibility http adapters", () => {
  it("sends a trusted Soliguide origin to the legacy api", async () => {
    const request = new FakeRequest();
    const adapter = new LegacyApiSupertestAdapter({
      post: () => request as any,
      get: () => request as any,
    });

    await adapter.search(
      {
        id: "case",
        title: "case",
        routeIntent: "search",
        payload: {},
      },
      buildPersona(),
    );

    expect(request.headers.origin).toBe("https://soliguide.fr");
    expect(request.headers.referer).toBe("https://soliguide.fr/recherche");
    expect(request.headers["x-document-referrer"]).toBe(
      "https://soliguide.fr/recherche",
    );
  });

  it("sends the same trusted origin to the public api", async () => {
    const request = new FakeRequest();
    const adapter = new PublicApiSupertestAdapter({
      post: () => request as any,
      get: () => request as any,
    });

    await adapter.search(
      {
        id: "case",
        title: "case",
        routeIntent: "search",
        payload: {},
      },
      buildPersona(),
    );

    expect(request.headers.origin).toBe("https://soliguide.fr");
    expect(request.headers.referer).toBe("https://soliguide.fr/recherche");
    expect(request.headers["x-document-referrer"]).toBe(
      "https://soliguide.fr/recherche",
    );
    expect(request.headers.authorization).toBe("JWT token");
  });
});

class FakeRequest implements PromiseLike<{ status: number; body: unknown }> {
  public readonly headers: Record<string, string> = {};

  set(name: string, value: string): this {
    this.headers[name.toLowerCase()] = value;
    return this;
  }

  send(_body: unknown): this {
    return this;
  }

  then<TResult1 = { status: number; body: unknown }, TResult2 = never>(
    onfulfilled?:
      | ((value: { status: number; body: unknown }) => TResult1 | PromiseLike<TResult1>)
      | null,
    _onrejected?:
      | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
      | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve({ status: 200, body: {} }).then(onfulfilled);
  }
}

function buildPersona(): PersonaContext {
  return {
    key: "PRO",
    status: UserStatus.PRO,
    isLogged: true,
    legacyJwt: "token",
    publicApiUserId: "user-id",
  };
}
