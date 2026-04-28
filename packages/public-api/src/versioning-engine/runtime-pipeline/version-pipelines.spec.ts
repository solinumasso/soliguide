import { ModuleRef } from "@nestjs/core";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { defineVersion, resource, schema } from "../dsl";
import type { VersionDefinition } from "../dsl";
import { DowngradePipeline } from "./downgrade.pipeline";
import { UpgradePipeline } from "./upgrade.pipeline";
import { VersionPathResolver } from "./version-path.resolver";
import {
  fromSingleToArray,
  mapObjectsAtPath,
  renameField,
} from "./transformers";

type PipelinePayload = {
  category?: string;
  categories?: string[];
  legacyOnly?: boolean;
  location?: unknown;
  locations?: unknown[];
  nested?: Array<{
    newName?: string;
    newOnly?: boolean;
    oldName?: string;
  }>;
  places?: Array<{
    modalities?: {
      _text?: string;
      accessibility?: { checked?: boolean; wheelchair?: boolean };
      inconditionnel?: boolean;
      pmr?: { checked?: boolean; wheelchair?: boolean };
      unconditional?: boolean;
    };
    tempInfo?: { closure?: { actif?: boolean; active?: boolean } };
    tempInfos?: { closure?: { actif?: boolean; active?: boolean } };
  }>;
  q?: string;
  word?: string;
};

describe("version pipelines", () => {
  it("upgrades request payloads through primitive changes", async () => {
    const { upgradePipeline } = createPipelines();

    await expect(
      upgradePipeline.apply({
        fromVersion: "2026-01-01",
        payload: {
          legacyOnly: true,
          nested: [{ oldName: "value" }],
          word: "food",
        },
        resourceName: "search-request",
      })
    ).resolves.toEqual({
      nested: [{ newName: "value" }],
      q: "food",
    });
  });

  it("downgrades response payloads through inverse primitive changes", async () => {
    const { downgradePipeline } = createPipelines();

    await expect(
      downgradePipeline.apply({
        payload: {
          nested: [{ newName: "value", newOnly: true }],
          q: "food",
        },
        resourceName: "search-response",
        toVersion: "2026-01-01",
      })
    ).resolves.toEqual({
      nested: [{ oldName: "value" }],
      word: "food",
    });
  });

  it("applies 2026-04-26 request upgrade transforms", async () => {
    const categoryUpgraded = fromSingleToArray(
      {
        category: "food",
        location: { geoType: "pays", geoValue: "FR" },
      },
      "category",
      "categories"
    );
    const upgraded = fromSingleToArray(
      categoryUpgraded,
      "location",
      "locations"
    );

    expect(upgraded).toEqual({
      categories: ["food"],
      locations: [{ geoType: "pays", geoValue: "FR" }],
    });
  });

  it("applies 2026-04-26 per-change transforms through pipelines", async () => {
    const { downgradePipeline, upgradePipeline } = createPipelines([
      defineVersion({
        baseVersion: "2026-01-01",
        resources: [
          resource<PipelinePayload>("search-request", {
            changes: ({ remove }) => [
              remove({
                payloadPath: "category",
                upgrade: (payload) =>
                  fromSingleToArray(payload, "category", "categories"),
              }),
            ],
            kind: "request",
          }),
          resource<PipelinePayload>("search-response", {
            changes: ({ add, patch, rename, replaceSchema }) => [
              rename({ from: "word", payloadPath: "", to: "q" }),
              patch({
                payloadPath: "",
                changes: [
                  replaceSchema({
                    downgrade: (data) =>
                      mapObjectsAtPath(data, "places.tempInfos", (tempInfo) => {
                        const closure = tempInfo.closure;

                        if (
                          closure &&
                          typeof closure === "object" &&
                          !Array.isArray(closure)
                        ) {
                          renameField(
                            closure as Record<string, unknown>,
                            "active",
                            "actif"
                          );
                        }
                      }),
                    payloadPath: "places.tempInfos",
                    schema: schema(z.object({})),
                  }),
                  rename({
                    from: "tempInfos",
                    payloadPath: "places",
                    to: "tempInfo",
                  }),
                  rename({
                    from: "inconditionnel",
                    payloadPath: "places.modalities",
                    to: "unconditional",
                  }),
                  replaceSchema({
                    downgrade: (data) =>
                      mapObjectsAtPath(data, "places.modalities.pmr", (pmr) => {
                        renameField(pmr, "wheelchair", "checked");
                      }),
                    payloadPath: "places.modalities.pmr",
                    schema: schema(z.object({})),
                  }),
                  rename({
                    from: "pmr",
                    payloadPath: "places.modalities",
                    to: "accessibility",
                  }),
                  add({
                    downgrade: (data) =>
                      mapObjectsAtPath(
                        data,
                        "places.modalities",
                        (modalities) => {
                          delete modalities._text;
                        }
                      ),
                    field: "_text",
                    payloadPath: "places.modalities",
                    schema: schema(z.string()),
                  }),
                ],
              }),
            ],
            kind: "response",
          }),
        ],
        version: "2026-04-26",
      }),
    ]);

    await expect(
      upgradePipeline.apply({
        fromVersion: "2026-01-01",
        payload: { category: "food" },
        resourceName: "search-request",
      })
    ).resolves.toEqual({ categories: ["food"] });

    await expect(
      downgradePipeline.apply({
        payload: {
          places: [
            {
              modalities: {
                _text: "readable",
                accessibility: { wheelchair: true },
                unconditional: true,
              },
              tempInfo: {
                closure: {
                  active: true,
                },
              },
            },
          ],
          q: "meal",
        },
        resourceName: "search-response",
        toVersion: "2026-01-01",
      })
    ).resolves.toEqual({
      places: [
        {
          modalities: {
            inconditionnel: true,
            pmr: {
              checked: true,
            },
          },
          tempInfos: {
            closure: {
              actif: true,
            },
          },
        },
      ],
      word: "meal",
    });
  });
});

function createPipelines(): {
  downgradePipeline: DowngradePipeline;
  upgradePipeline: UpgradePipeline;
};
function createPipelines(definitions: VersionDefinition[]): {
  downgradePipeline: DowngradePipeline;
  upgradePipeline: UpgradePipeline;
};
function createPipelines(
  definitions = [
    defineVersion({
      baseVersion: "2026-01-01",
      resources: [
        resource<PipelinePayload>("search-request", {
          changes: ({ remove, rename }) => [
            remove({ payloadPath: "legacyOnly" }),
            rename({ from: "word", payloadPath: "", to: "q" }),
            rename({ from: "oldName", payloadPath: "nested", to: "newName" }),
          ],
          kind: "request",
        }),
        resource<PipelinePayload>("search-response", {
          changes: ({ add, rename }) => [
            rename({ from: "word", payloadPath: "", to: "q" }),
            rename({ from: "oldName", payloadPath: "nested", to: "newName" }),
            add({
              field: "newOnly",
              payloadPath: "nested",
              schema: schema(z.boolean()),
            }),
          ],
          kind: "response",
        }),
      ],
      version: "2026-04-26",
    }),
  ]
): {
  downgradePipeline: DowngradePipeline;
  upgradePipeline: UpgradePipeline;
} {
  const resolver = new VersionPathResolver(definitions);
  const moduleRef = {} as ModuleRef;

  return {
    downgradePipeline: new DowngradePipeline(moduleRef, resolver),
    upgradePipeline: new UpgradePipeline(moduleRef, resolver),
  };
}
