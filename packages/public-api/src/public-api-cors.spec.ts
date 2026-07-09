import { beforeEach, describe, expect, it } from "vitest";

import { isPublicApiCorsOriginAllowed } from "./public-api-cors";

describe("Public API CORS", () => {
  beforeEach(() => {
    process.env.ENV = "prod";
    process.env.SOLIGUIDE_FR_URL = "https://soliguide.fr";
    process.env.SOLIGUIA_ES_URL = "https://soliguia.es";
    process.env.SOLIGUIA_AD_URL = "https://soliguia.ad";
    process.env.WEBAPP_FR_URL = "https://app.soliguide.fr";
    process.env.WEBAPP_ES_URL = "https://app.soliguia.es";
    process.env.WEBAPP_AD_URL = "https://app.soliguia.ad";
    process.env.WIDGET_URL = "https://widget.soliguide.fr";
  });

  it("allows local frontend origins in dev", () => {
    expect(
      isPublicApiCorsOriginAllowed("http://localhost:4200", "dev")
    ).toBe(true);
  });

  it("allows configured frontend and webapp origins in production", () => {
    expect(
      isPublicApiCorsOriginAllowed("https://soliguide.fr", "prod")
    ).toBe(true);
    expect(
      isPublicApiCorsOriginAllowed("https://app.soliguide.fr", "prod")
    ).toBe(true);
    expect(
      isPublicApiCorsOriginAllowed("https://widget.soliguide.fr", "prod")
    ).toBe(true);
  });

  it("rejects unknown origins in production", () => {
    expect(
      isPublicApiCorsOriginAllowed("https://example.org", "prod")
    ).toBe(false);
  });

  it("allows requests without origin", () => {
    expect(isPublicApiCorsOriginAllowed(undefined, "prod")).toBe(true);
  });
});
