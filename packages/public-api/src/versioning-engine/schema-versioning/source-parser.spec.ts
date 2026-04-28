import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { VersionSourceParser } from "./source-parser";

const PACKAGE_ROOT = resolve(__dirname, "..", "..", "..");
const TSCONFIG_PATH = resolve(PACKAGE_ROOT, "tsconfig.json");
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.map((directoryPath) =>
      rm(directoryPath, { force: true, recursive: true })
    )
  );
  temporaryDirectories.length = 0;
});

describe("VersionSourceParser", () => {
  it("parses defineVersion/resource/change helper source", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-00",
      versionDefinitionContent: `
import { z } from "zod";
import {
  defineVersion,
  remove,
  rename,
  replaceSchema,
  resource,
  schema,
} from "../dsl";

type RequestShape = {
  modalities?: {
    animal?: boolean;
  };
  publics?: {
    age?: {
      min?: number;
      max?: number;
    };
  };
};

type ResponseShape = {
  places?: Array<{
    _id?: string;
  }>;
};

export default defineVersion({
  version: "2026-05-00",
  baseVersion: "2026-01-01",
  resources: [
    resource<RequestShape>("search-request", { kind: "request", changes: ({ rename, replaceSchema }) => [
      replaceSchema({
        payloadPath: "modalities",
        schema: schema(z.object({ animal: z.boolean().optional() }).optional()),
      }),
      rename({
        from: "animal",
        payloadPath: "modalities",
        to: "acceptsPets",
      }),
      replaceSchema({
        payloadPath: "publics.age",
        schema: schema(
          z.object({
            max: z.number().optional(),
            min: z.number().optional(),
          }).optional()
        ),
      }),
    ]}),
    resource<ResponseShape>("search-response", { kind: "response", changes: [
      remove({
        payloadPath: "places._id",
      }),
    ]}),
  ],
});
`,
    });

    const parser = new VersionSourceParser();

    const parsedVersion = parser.parseVersionDefinition({
      tsConfigFilePath: TSCONFIG_PATH,
      version: "2026-05-00",
      versionsRootDir,
    });

    expect(parsedVersion.version).toBe("2026-05-00");
    expect(parsedVersion.baseVersion).toBe("2026-01-01");
    expect(
      parsedVersion.resources.map((resource) => resource.resourceName)
    ).toEqual(["search-request", "search-response"]);

    const requestResource = parsedVersion.resources[0];
    expect(requestResource.changes.map((change) => change.type)).toEqual([
      "replaceSchema",
      "rename",
      "replaceSchema",
    ]);

    const renameChange = requestResource.changes[1];
    expect(renameChange.type).toBe("rename");
    expect(renameChange.payload).toMatchObject({
      from: "animal",
      payloadPath: "modalities",
      to: "acceptsPets",
    });

    const responseResource = parsedVersion.resources[1];
    expect(responseResource.changes).toHaveLength(1);
    expect(responseResource.changes[0].type).toBe("remove");
    expect(responseResource.changes[0].payload).toMatchObject({
      payloadPath: "places._id",
    });
  });

  it("fails when the default export does not call defineVersion", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-01",
      versionDefinitionContent: `
const definition = {
  version: "2026-05-01",
  baseVersion: "2026-01-01",
  resources: [],
};

export default definition;
`,
    });

    const parser = new VersionSourceParser();

    expect(() =>
      parser.parseVersionDefinition({
        tsConfigFilePath: TSCONFIG_PATH,
        version: "2026-05-01",
        versionsRootDir,
      })
    ).toThrow("must be a call expression");
  });

  it("fails when resource entries are not direct resource(...) calls", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-02",
      versionDefinitionContent: `
import { defineVersion, remove, resource } from "src/versioning-engine/dsl";

const sampleResource = resource("sample", { kind: "request", changes: [
  remove({ payloadPath: "root.field" }),
]});

export default defineVersion({
  version: "2026-05-02",
  baseVersion: "2026-01-01",
  resources: [sampleResource],
});
`,
    });

    const parser = new VersionSourceParser();

    expect(() =>
      parser.parseVersionDefinition({
        tsConfigFilePath: TSCONFIG_PATH,
        version: "2026-05-02",
        versionsRootDir,
      })
    ).toThrow("must be a call expression");
  });

  it("rejects previous resource array signatures", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-10",
      versionDefinitionContent: `
import { defineVersion, remove, resource } from "src/versioning-engine/dsl";

export default defineVersion({
  version: "2026-05-10",
  baseVersion: "2026-01-01",
  resources: [
    resource("sample", [
      remove({ payloadPath: "root.field" }),
    ]),
  ],
});
`,
    });

    const parser = new VersionSourceParser();

    expect(() =>
      parser.parseVersionDefinition({
        tsConfigFilePath: TSCONFIG_PATH,
        version: "2026-05-10",
        versionsRootDir,
      })
    ).toThrow("requires an options object literal");
  });

  it("fails when change entries are not direct helper calls", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-03",
      versionDefinitionContent: `
import { defineVersion, remove, resource } from "src/versioning-engine/dsl";

const removeField = remove<any>({ payloadPath: "modalities..animal" as any });

export default defineVersion({
  version: "2026-05-03",
  baseVersion: "2026-01-01",
  resources: [
    resource("sample", {
      kind: "request",
      changes: [removeField],
    }),
  ],
});
`,
    });

    const parser = new VersionSourceParser();

    expect(() =>
      parser.parseVersionDefinition({
        tsConfigFilePath: TSCONFIG_PATH,
        version: "2026-05-03",
        versionsRootDir,
      })
    ).toThrow("must be a call expression");
  });

  it("fails when schema payloads skip the schema(...) wrapper", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-04",
      versionDefinitionContent: `
import { z } from "zod";
import { defineVersion, replaceSchema, resource } from "src/versioning-engine/dsl";

export default defineVersion({
  version: "2026-05-04",
  baseVersion: "2026-01-01",
  resources: [
    resource("sample", {
      kind: "request",
      changes: [
        replaceSchema<any>({
          payloadPath: "root.field",
          schema: z.string(),
        }),
      ],
    }),
  ],
});
`,
    });

    const parser = new VersionSourceParser();

    expect(() =>
      parser.parseVersionDefinition({
        tsConfigFilePath: TSCONFIG_PATH,
        version: "2026-05-04",
        versionsRootDir,
      })
    ).toThrow("must call schema(...)");
  });

  it("rejects removed patch selector/action payloads", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-05",
      versionDefinitionContent: `
import { z } from "zod";
import { patch, defineVersion, resource, schema } from "src/versioning-engine/dsl";

export default defineVersion({
  version: "2026-05-05",
  baseVersion: "2026-01-01",
  resources: [
    resource("sample", {
      kind: "request",
      changes: [
        patch<any>({
          payloadPath: "root",
          selector: { type: "field", field: "target" },
          action: {
            type: "insert",
            field: "added",
            schema: schema(z.string()),
          },
        }),
      ],
    }),
  ],
});
`,
    });

    const parser = new VersionSourceParser();

    expect(() =>
      parser.parseVersionDefinition({
        tsConfigFilePath: TSCONFIG_PATH,
        version: "2026-05-05",
        versionsRootDir,
      })
    ).toThrow('Missing required property "changes"');
  });

  it("parses resource options, patch groups, metadata and local schema constants", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-06",
      versionDefinitionContent: `
import { z } from "zod";
import { defineVersion, resource, schema } from "src/versioning-engine/dsl";

class SearchResponseContextProvider {}

const sharedClosureSchema = schema(z.object({ active: z.boolean().optional() }));

export default defineVersion({
  version: "2026-05-06",
  baseVersion: "2026-01-01",
  resources: [
    resource("search-response", {
      kind: "response",
      contextProvider: SearchResponseContextProvider,
      changes: ({ patch, rename, replaceSchema }) => [
        patch({
          title: "Normalize closures",
          impact: "breaking",
          payloadPath: "",
          changes: [
            replaceSchema<any>({
              title: "Normalize place closure",
              payloadPath: "places.tempInfos.closure",
              schema: sharedClosureSchema,
            }),
            rename<any>({
              payloadPath: "places",
              from: "tempInfos",
              to: "tempInfo",
            }),
          ],
          downgrade: (payload) => payload,
        }),
      ],
    }),
  ],
});
`,
    });

    const parser = new VersionSourceParser();
    const parsedVersion = parser.parseVersionDefinition({
      tsConfigFilePath: TSCONFIG_PATH,
      version: "2026-05-06",
      versionsRootDir,
    });

    expect(parsedVersion.resources[0]).toMatchObject({
      contextProvider: "SearchResponseContextProvider",
      kind: "response",
      resourceName: "search-response",
    });
    expect(parsedVersion.resources[0].changes).toHaveLength(2);
    expect(parsedVersion.resources[0].changes[0]).toMatchObject({
      metadata: {
        groupTitle: "Normalize closures",
        impact: "breaking",
        title: "Normalize place closure",
      },
      payload: {
        payloadPath: "places.tempInfos.closure",
        schema: {
          text: "z.object({ active: z.boolean().optional() })",
        },
      },
      type: "replaceSchema",
    });
    expect(parsedVersion.resources[0].changes[1]).toMatchObject({
      metadata: {
        groupTitle: "Normalize closures",
      },
      type: "rename",
    });
  });

  it("parses imported resource changes and imported schema constants", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-08",
      extraFiles: {
        "schemas.ts": `
import { z } from "zod";
import { schema } from "../dsl";

export const rootStringSchema = schema(z.string().nullable().optional());
`,
        "search-request.changes.ts": `
import type { ResourceChangesFactory } from "../dsl";
import { rootStringSchema } from "./schemas";

type RequestShape = {
  word?: string;
  openToday?: boolean;
};

export const searchRequestChanges: ResourceChangesFactory<RequestShape, "request"> = ({
  patch,
  rename,
  replaceSchema,
}) => [
  patch({
    title: "Normalize root request fields",
    payloadPath: "",
    changes: [
      rename({
        payloadPath: "",
        from: "word",
        to: "searchText",
      }),
      replaceSchema({
        payloadPath: "openToday",
        schema: rootStringSchema,
      }),
    ],
  }),
];
`,
      },
      versionDefinitionContent: `
import { defineVersion, resource } from "../dsl";
import { searchRequestChanges } from "./search-request.changes";

export default defineVersion({
  version: "2026-05-08",
  baseVersion: "2026-01-01",
  resources: [
    resource("search-request", {
      kind: "request",
      changes: searchRequestChanges,
    }),
  ],
});
`,
    });

    const parser = new VersionSourceParser();
    const parsedVersion = parser.parseVersionDefinition({
      tsConfigFilePath: TSCONFIG_PATH,
      version: "2026-05-08",
      versionsRootDir,
    });

    expect(parsedVersion.resources[0].changes).toHaveLength(2);
    expect(parsedVersion.resources[0].changes[0]).toMatchObject({
      metadata: {
        groupTitle: "Normalize root request fields",
      },
      payload: {
        from: "word",
        payloadPath: "",
        to: "searchText",
      },
      type: "rename",
    });
    expect(parsedVersion.resources[0].changes[1]).toMatchObject({
      payload: {
        payloadPath: "openToday",
        schema: {
          text: "z.string().nullable().optional()",
        },
      },
      type: "replaceSchema",
    });
    expect(parsedVersion.resources[0].changes[0].sourceFilePath).toContain(
      "search-request.changes.ts"
    );
  });

  it("rejects unresolved imported changes identifiers", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-09",
      versionDefinitionContent: `
import { defineVersion, resource } from "src/versioning-engine/dsl";

export default defineVersion({
  version: "2026-05-09",
  baseVersion: "2026-01-01",
  resources: [
    resource("search-request", {
      kind: "request",
      changes: missingChanges,
    }),
  ],
});
`,
    });

    const parser = new VersionSourceParser();

    expect(() =>
      parser.parseVersionDefinition({
        tsConfigFilePath: TSCONFIG_PATH,
        version: "2026-05-09",
        versionsRootDir,
      })
    ).toThrow("cannot resolve identifier missingChanges");
  });

  it("rejects nested patch groups", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-07",
      versionDefinitionContent: `
import { defineVersion, resource } from "src/versioning-engine/dsl";

export default defineVersion({
  version: "2026-05-07",
  baseVersion: "2026-01-01",
  resources: [
    resource("sample", {
      kind: "response",
      changes: ({ patch }) => [
        patch({
          title: "Outer",
          payloadPath: "",
          changes: [
            patch<any>({
              title: "Inner",
              payloadPath: "root",
              changes: [],
            }),
          ],
        }),
      ],
    }),
  ],
});
`,
    });

    const parser = new VersionSourceParser();

    expect(() =>
      parser.parseVersionDefinition({
        tsConfigFilePath: TSCONFIG_PATH,
        version: "2026-05-07",
        versionsRootDir,
      })
    ).toThrow("cannot contain nested patch changes");
  });
});

async function createTempVersionFixture(options: {
  extraFiles?: Record<string, string>;
  version: string;
  versionDefinitionContent: string;
}): Promise<string> {
  const tempDirectoryPath = await mkdtemp(
    join(tmpdir(), "source-parser-spec-")
  );
  temporaryDirectories.push(tempDirectoryPath);

  const versionsRootDir = join(tempDirectoryPath, "versions");
  const versionDirPath = join(versionsRootDir, options.version);
  await mkdir(versionDirPath, { recursive: true });
  await writeVersionFile(
    versionDirPath,
    options.version,
    options.versionDefinitionContent
  );

  for (const [relativePath, content] of Object.entries(
    options.extraFiles ?? {}
  )) {
    const filePath = join(versionDirPath, relativePath);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, content, "utf-8");
  }

  return versionsRootDir;
}

async function writeVersionFile(
  versionDirPath: string,
  version: string,
  versionDefinitionContent: string
): Promise<void> {
  await mkdir(versionDirPath, { recursive: true });
  await writeFile(
    join(versionDirPath, `${version}.ts`),
    versionDefinitionContent,
    "utf-8"
  );
}
