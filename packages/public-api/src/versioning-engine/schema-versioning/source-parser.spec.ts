import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { VersionSourceParser } from "./source-parser";

const PACKAGE_ROOT = resolve(__dirname, "..", "..", "..");
const TSCONFIG_PATH = resolve(PACKAGE_ROOT, "tsconfig.json");
const REAL_VERSIONS_ROOT = resolve(PACKAGE_ROOT, "src", "versions");

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
  it("parses defineVersion/resource/change helper source", () => {
    const parser = new VersionSourceParser();

    const parsedVersion = parser.parseVersionDefinition({
      tsConfigFilePath: TSCONFIG_PATH,
      version: "2026-04-17",
      versionsRootDir: REAL_VERSIONS_ROOT,
    });

    expect(parsedVersion.version).toBe("2026-04-17");
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

const sampleResource = resource("sample", [
  remove<any>({ payloadPath: "root.field" }),
]);

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

  it("fails when change entries are not direct helper calls", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-03",
      versionDefinitionContent: `
import { defineVersion, remove, resource } from "src/versioning-engine/dsl";

const removeField = remove<any>({ payloadPath: "modalities..animal" as any });

export default defineVersion({
  version: "2026-05-03",
  baseVersion: "2026-01-01",
  resources: [resource("sample", [removeField])],
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
    resource("sample", [
      replaceSchema<any>({
        payloadPath: "root.field",
        schema: z.string(),
      }),
    ]),
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

  it("parses custom selector/action payloads via the narrowed grammar", async () => {
    const versionsRootDir = await createTempVersionFixture({
      version: "2026-05-05",
      versionDefinitionContent: `
import { z } from "zod";
import { custom, defineVersion, resource, schema } from "src/versioning-engine/dsl";

export default defineVersion({
  version: "2026-05-05",
  baseVersion: "2026-01-01",
  resources: [
    resource("sample", [
      custom<any>({
        payloadPath: "root",
        selector: { type: "field", field: "target" },
        action: {
          type: "insert",
          field: "added",
          schema: schema(z.string()),
        },
      }),
    ]),
  ],
});
`,
    });

    const parser = new VersionSourceParser();
    const parsedVersion = parser.parseVersionDefinition({
      tsConfigFilePath: TSCONFIG_PATH,
      version: "2026-05-05",
      versionsRootDir,
    });

    expect(parsedVersion.resources[0].changes[0]).toMatchObject({
      type: "custom",
      payload: {
        payloadPath: "root",
        selector: {
          type: "field",
          field: "target",
        },
        action: {
          type: "insert",
          field: "added",
        },
      },
    });
  });
});

async function createTempVersionFixture(options: {
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
