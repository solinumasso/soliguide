import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { SchemaVersionGenerator } from "./schema-version.generator";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.map((directoryPath) =>
      rm(directoryPath, { force: true, recursive: true })
    )
  );
  temporaryDirectories.length = 0;
});

describe("SchemaVersionGenerator", () => {
  it("applies add/remove/rename/replace/patch-group changes and prunes unused nodes", async () => {
    const packageRootDir = await createSyntheticPackageRoot();

    await new SchemaVersionGenerator().generate({
      formatAndLint: false,
      packageRootDir,
      version: "2026-04-17",
    });

    const generatedSampleSchemaPath = join(
      packageRootDir,
      "src/versions/2026-04-17/2026-04-17.sample.schema.generated.ts"
    );
    const generatedSampleSchema = await readFile(
      generatedSampleSchemaPath,
      "utf-8"
    );

    expect(generatedSampleSchema).toContain(
      "export const v20260417SampleSchema"
    );
    expect(generatedSampleSchema).toContain("export type V20260417Sample");
    expect(generatedSampleSchema).toContain(
      "export default v20260417SampleSchema"
    );

    expect(generatedSampleSchema).toContain("addedField");
    expect(generatedSampleSchema).toContain("renamedMe");
    expect(generatedSampleSchema).toContain(
      "replaceMe: z.number().int().nullable().optional()"
    );
    expect(generatedSampleSchema).toContain(
      "patchTarget: z.boolean().nullable().optional()"
    );

    expect(generatedSampleSchema).not.toContain("removeMe:");
    expect(generatedSampleSchema).not.toContain("renameMe:");

    expect(generatedSampleSchema).not.toContain("unusedLocal");
    expect(generatedSampleSchema).not.toContain("ZodType");

    const generatedUntouchedSchemaPath = join(
      packageRootDir,
      "src/versions/2026-04-17/2026-04-17.untouched.schema.generated.ts"
    );
    const generatedUntouchedSchema = await readFile(
      generatedUntouchedSchemaPath,
      "utf-8"
    );

    expect(generatedUntouchedSchema).toContain("v20260417UntouchedSchema");
    expect(generatedUntouchedSchema).toContain(
      'meta({ id: "v20260417Untouched" })'
    );

    const generatedRegistryPath = join(
      packageRootDir,
      "src/versions/2026-04-17/open-api.registry.ts"
    );
    const generatedRegistry = await readFile(generatedRegistryPath, "utf-8");

    expect(generatedRegistry).toContain(
      'import { VersionRegistry } from "../../versioning-engine";'
    );
    expect(generatedRegistry).toContain(
      'import v20260417SampleSchema from "./2026-04-17.sample.schema.generated";'
    );

    const generatedVersionsIndex = await readFile(
      join(packageRootDir, "src/versions/index.ts"),
      "utf-8"
    );

    expect(generatedVersionsIndex).toContain("v20260101: v20260101Registry");
    expect(generatedVersionsIndex).toContain("v20260417: v20260417Registry");
    expect(
      generatedVersionsIndex.indexOf("v20260101: v20260101Registry")
    ).toBeLessThan(
      generatedVersionsIndex.indexOf("v20260417: v20260417Registry")
    );
  });

  it("integration: generates a fixture version and applies concrete request/response changes", async () => {
    const packageRootDir = await createIntegrationPackageRoot();

    await new SchemaVersionGenerator().generate({
      formatAndLint: false,
      packageRootDir,
      version: "2026-04-17",
    });

    const generatedRequestSchema = await readFile(
      join(
        packageRootDir,
        "src/versions/2026-04-17/2026-04-17.search-request.schema.generated.ts"
      ),
      "utf-8"
    );

    expect(generatedRequestSchema).toContain(
      "export const v20260417SearchRequestSchema"
    );
    expect(generatedRequestSchema).toContain(
      "export type V20260417SearchRequest"
    );
    expect(generatedRequestSchema).toContain(
      "export default v20260417SearchRequestSchema"
    );

    expect(generatedRequestSchema).toContain("categories: z");
    expect(generatedRequestSchema).toContain(".min(1)");
    expect(generatedRequestSchema).toContain("acceptsPets");
    const modalitiesBlock = extractBlock(
      generatedRequestSchema,
      "const modalitiesSchema = z",
      "export const v20260417SearchRequestSchema"
    );
    expect(modalitiesBlock).not.toContain("animal:");
    expect(modalitiesBlock).toContain("acceptsPets:");

    const generatedResponseSchema = await readFile(
      join(
        packageRootDir,
        "src/versions/2026-04-17/2026-04-17.search-response.schema.generated.ts"
      ),
      "utf-8"
    );

    expect(generatedResponseSchema).toContain(
      "export const v20260417SearchResponseSchema"
    );
    expect(generatedResponseSchema).toContain(
      "export type V20260417SearchResponse"
    );
    expect(generatedResponseSchema).toContain(
      "export default v20260417SearchResponseSchema"
    );

    const placeResponseBlock = extractBlock(
      generatedResponseSchema,
      "const v20260417SearchPlaceResponseSchema = z",
      '.meta({ id: "v20260417SearchPlaceResponse" })'
    );
    expect(placeResponseBlock).not.toContain("legacyId:");

    expect(generatedRequestSchema).not.toContain("2026-01-01.search-request");
    expect(generatedResponseSchema).not.toContain("2026-01-01.search-response");
  });
});

async function createSyntheticPackageRoot(): Promise<string> {
  const tempDirectoryPath = await mkdtemp(
    join(tmpdir(), "schema-generator-spec-")
  );
  temporaryDirectories.push(tempDirectoryPath);

  await mkdir(join(tempDirectoryPath, "src", "versions", "2026-01-01"), {
    recursive: true,
  });
  await mkdir(join(tempDirectoryPath, "src", "versions", "2026-04-17"), {
    recursive: true,
  });

  await writeFile(
    join(tempDirectoryPath, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          baseUrl: ".",
          esModuleInterop: true,
          module: "commonjs",
          skipLibCheck: true,
          strict: true,
          target: "ES2021",
        },
      },
      null,
      2
    ),
    "utf-8"
  );

  await writeFile(
    join(tempDirectoryPath, "src/versions/index.ts"),
    `import { VersionRegistry } from "../versioning-engine";
import v20260101Registry from "./2026-01-01/open-api.registry";

export const versionRegistry: Record<string, VersionRegistry> = {
  v20260101: v20260101Registry,
};
`,
    "utf-8"
  );

  await writeFile(
    join(
      tempDirectoryPath,
      "src/versions/2026-01-01/2026-01-01.sample.schema.generated.ts"
    ),
    `import { z, ZodType } from "zod";

const unusedLocal = z.string();

export const v20260101SampleSchema = z
  .object({
    root: z.object({
      removeMe: z.string().nullable().optional(),
      renameMe: z.string().nullable().optional(),
      replaceMe: z.string().nullable().optional(),
      patchTarget: z.string().nullable().optional(),
    }),
    places: z.array(
      z.object({
        _id: z.string().nullable().optional(),
      })
    ),
  })
  .meta({ id: "v20260101Sample" });

export type V20260101Sample = z.infer<typeof v20260101SampleSchema>;
export default v20260101SampleSchema;
`,
    "utf-8"
  );

  await writeFile(
    join(
      tempDirectoryPath,
      "src/versions/2026-01-01/2026-01-01.untouched.schema.generated.ts"
    ),
    `import { z } from "zod";

export const v20260101UntouchedSchema = z
  .object({
    status: z.string().nullable().optional(),
  })
  .meta({ id: "v20260101Untouched" });

export type V20260101Untouched = z.infer<typeof v20260101UntouchedSchema>;
export default v20260101UntouchedSchema;
`,
    "utf-8"
  );

  await writeFile(
    join(tempDirectoryPath, "src/versions/2026-01-01/open-api.registry.ts"),
    `import { VersionRegistry } from "src/versioning-engine";
import v20260101SampleSchema from "./2026-01-01.sample.schema.generated";
import v20260101UntouchedSchema from "./2026-01-01.untouched.schema.generated";

export const versionRegistry: VersionRegistry = {
  "sample-op": {
    openApi: {
      requestSchema: v20260101SampleSchema,
      responses: {
        200: v20260101UntouchedSchema,
      },
    },
  },
};

export default versionRegistry;
`,
    "utf-8"
  );

  await writeFile(
    join(tempDirectoryPath, "src/versions/2026-04-17/2026-04-17.ts"),
    `import { z } from "zod";
import {
  add,
  patch,
  defineVersion,
  remove,
  rename,
  replaceSchema,
  resource,
  schema,
} from "src/versioning-engine/dsl";

export default defineVersion({
  version: "2026-04-17",
  baseVersion: "2026-01-01",
  resources: [
    resource("sample", {
      kind: "request",
      changes: [
        add<any>({
          payloadPath: "root",
          field: "addedField",
          schema: schema(z.string().nullable().optional()),
        }),
        remove<any>({
          payloadPath: "root.removeMe",
        }),
        rename<any>({
          payloadPath: "root",
          from: "renameMe",
          to: "renamedMe",
        }),
        replaceSchema<any>({
          payloadPath: "root.replaceMe",
          schema: schema(z.number().int().nullable().optional()),
        }),
        patch<any>({
          title: "Patch target",
          payloadPath: "root",
          changes: [
            replaceSchema<any>({
              payloadPath: "root.patchTarget",
              schema: schema(z.boolean().nullable().optional()),
            }),
          ],
        }),
      ],
    }),
  ],
});
`,
    "utf-8"
  );

  return tempDirectoryPath;
}

async function createIntegrationPackageRoot(): Promise<string> {
  const tempDirectoryPath = await mkdtemp(
    join(tmpdir(), "schema-generator-integration-")
  );
  temporaryDirectories.push(tempDirectoryPath);

  await mkdir(join(tempDirectoryPath, "src", "versions"), { recursive: true });

  await writeFile(
    join(tempDirectoryPath, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          baseUrl: ".",
          esModuleInterop: true,
          module: "commonjs",
          skipLibCheck: true,
          strict: true,
          target: "ES2021",
        },
      },
      null,
      2
    ),
    "utf-8"
  );

  await writeFile(
    join(tempDirectoryPath, "src/versions/index.ts"),
    `import { VersionRegistry } from "../versioning-engine";
import v20260101Registry from "./2026-01-01/open-api.registry";

export const versionRegistry: Record<string, VersionRegistry> = {
  v20260101: v20260101Registry,
};
`,
    "utf-8"
  );

  await mkdir(join(tempDirectoryPath, "src/versions/2026-01-01"), {
    recursive: true,
  });
  await mkdir(join(tempDirectoryPath, "src/versions/2026-04-17"), {
    recursive: true,
  });

  await writeFile(
    join(
      tempDirectoryPath,
      "src/versions/2026-01-01/2026-01-01.search-request.schema.generated.ts"
    ),
    `import { z } from "zod";

const modalitiesSchema = z.object({
  animal: z.boolean().nullable().optional(),
});

export const v20260101SearchRequestSchema = z.object({
  categories: z.array(z.string()).nullable().optional(),
  modalities: modalitiesSchema.nullable().optional(),
});

export type V20260101SearchRequest = z.infer<typeof v20260101SearchRequestSchema>;
export default v20260101SearchRequestSchema;
`,
    "utf-8"
  );

  await writeFile(
    join(
      tempDirectoryPath,
      "src/versions/2026-01-01/2026-01-01.search-response.schema.generated.ts"
    ),
    `import { z } from "zod";

const v20260101SearchPlaceResponseSchema = z.object({
  legacyId: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
});

export const v20260101SearchResponseSchema = z.object({
  places: z.array(v20260101SearchPlaceResponseSchema),
});

export type V20260101SearchResponse = z.infer<typeof v20260101SearchResponseSchema>;
export default v20260101SearchResponseSchema;
`,
    "utf-8"
  );

  await writeFile(
    join(tempDirectoryPath, "src/versions/2026-01-01/open-api.registry.ts"),
    `import { VersionRegistry } from "src/versioning-engine";
import v20260101SearchRequestSchema from "./2026-01-01.search-request.schema.generated";
import v20260101SearchResponseSchema from "./2026-01-01.search-response.schema.generated";

export const versionRegistry: VersionRegistry = {
  "search-places": {
    openApi: {
      requestSchema: v20260101SearchRequestSchema,
      responses: { 200: v20260101SearchResponseSchema },
    },
  },
};

export default versionRegistry;
`,
    "utf-8"
  );

  await writeFile(
    join(tempDirectoryPath, "src/versions/2026-04-17/2026-04-17.ts"),
    `import { z } from "zod";
import { defineVersion, remove, rename, replaceSchema, resource, schema } from "src/versioning-engine/dsl";

export default defineVersion({
  version: "2026-04-17",
  baseVersion: "2026-01-01",
  resources: [
    resource("search-request", {
      kind: "request",
      changes: [
        replaceSchema({
          payloadPath: "categories",
          schema: schema(z.array(z.string()).min(1).nullable().optional()),
        }),
        rename({ payloadPath: "modalities", from: "animal", to: "acceptsPets" }),
      ],
    }),
    resource("search-response", {
      kind: "response",
      changes: [remove({ payloadPath: "places.legacyId" })],
    }),
  ],
});
`,
    "utf-8"
  );

  return tempDirectoryPath;
}

function extractBlock(
  source: string,
  startToken: string,
  endToken: string
): string {
  const startIndex = source.indexOf(startToken);
  if (startIndex < 0) {
    return "";
  }

  const endIndex = source.indexOf(endToken, startIndex);
  if (endIndex < 0) {
    return source.slice(startIndex);
  }

  return source.slice(startIndex, endIndex + endToken.length);
}
