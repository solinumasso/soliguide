import { describe, expect, it } from "vitest";

import { ServiceFiltersDefaultPolicy } from "./service-filters-default.policy";

describe("ServiceFiltersDefaultPolicy", () => {
  const policy = new ServiceFiltersDefaultPolicy();

  it("sets serviceFiltersEnabled to true when missing", () => {
    const result = policy.apply({});

    expect(result.serviceFiltersEnabled).toBe(true);
  });

  it("keeps explicit serviceFiltersEnabled=false", () => {
    const result = policy.apply({ serviceFiltersEnabled: false });

    expect(result.serviceFiltersEnabled).toBe(false);
  });

  it("keeps explicit serviceFiltersEnabled=true", () => {
    const result = policy.apply({ serviceFiltersEnabled: true });

    expect(result.serviceFiltersEnabled).toBe(true);
  });
});
