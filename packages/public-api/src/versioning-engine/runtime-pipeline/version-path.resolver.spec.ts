import { describe, expect, it } from "vitest";

import { defineVersion, resource } from "../dsl";
import type { VersionDefinition } from "../dsl";
import { VersionPathResolver } from "./version-path.resolver";

describe("VersionPathResolver", () => {
  it("finds the public API journey from a partner's pinned contract to the current contract", () => {
    const resolver = new VersionPathResolver(createDefinitions());

    const path = resolver.resolveUpgradePath("2026-01-01");

    expect(path).toHaveLength(2);
    expect(path.map(toVersionTransition)).toEqual([
      "2026-01-01 -> 2026-04-26",
      "2026-04-26 -> 2026-07-01",
    ]);
    expect(path.map((segment) => segment.definition.version)).toEqual([
      "2026-04-26",
      "2026-07-01",
    ]);
    expect(resolver.getCanonicalVersion()).toBe("2026-07-01");
  });

  it("walks the same public API journey backward for a legacy client response", () => {
    const resolver = new VersionPathResolver(createDefinitions());

    const path = resolver.resolveDowngradePath("2026-07-01", "2026-01-01");

    expect(path.map(toVersionTransition)).toEqual([
      "2026-04-26 -> 2026-07-01",
      "2026-01-01 -> 2026-04-26",
    ]);
  });

  it("recognizes published contracts and the resources exposed by each one", () => {
    const definitions = createDefinitions();
    const resolver = new VersionPathResolver(definitions);
    const aprilDefinition = definitions[0];

    expect(resolver.isVersionSupported("2026-01-01")).toBe(true);
    expect(resolver.isVersionSupported("2026-04-26")).toBe(true);
    expect(resolver.isVersionSupported("2025-12-01")).toBe(false);
    expect(
      resolver.hasResource(aprilDefinition, "search-request", "request")
    ).toBe(true);
    expect(
      resolver.hasResource(aprilDefinition, "search-response", "request")
    ).toBe(false);
    expect(
      resolver.hasResource(aprilDefinition, "unknown-resource", "response")
    ).toBe(false);
  });

  it("stops before payload conversion when no published migration route exists", () => {
    const resolver = new VersionPathResolver(createDefinitions());

    expect(() =>
      resolver.resolveUpgradePath("2026-01-01", "2026-10-01")
    ).toThrow("Missing API version path from 2026-01-01 to 2026-10-01");
  });
});

function createDefinitions(): VersionDefinition[] {
  return [
    defineVersion({
      baseVersion: "2026-01-01",
      resources: [
        resource("search-request", {
          changes: [],
          kind: "request",
        }),
        resource("search-response", {
          changes: [],
          kind: "response",
        }),
      ],
      version: "2026-04-26",
    }),
    defineVersion({
      baseVersion: "2026-04-26",
      resources: [
        resource("search-request", {
          changes: [],
          kind: "request",
        }),
      ],
      version: "2026-07-01",
    }),
  ];
}

function toVersionTransition(segment: {
  fromVersion: string;
  toVersion: string;
}): string {
  return `${segment.fromVersion} -> ${segment.toVersion}`;
}
