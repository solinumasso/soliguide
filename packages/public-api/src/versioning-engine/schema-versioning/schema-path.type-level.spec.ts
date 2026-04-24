import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import ts from "typescript";
import { afterEach, describe, expect, it } from "vitest";

const PACKAGE_ROOT = resolve(__dirname, "..", "..", "..");
const SCHEMA_PATH_FILE_PATH = resolve(
  PACKAGE_ROOT,
  "src/versioning-engine/dsl/schema-path"
).replaceAll("\\", "/");
const DSL_FILE_PATH = resolve(
  PACKAGE_ROOT,
  "src/versioning-engine/dsl"
).replaceAll("\\", "/");
const SEARCH_REQUEST_SCHEMA_FILE_PATH = resolve(
  PACKAGE_ROOT,
  "src/versions/2026-01-01/2026-01-01.search-request.schema.generated"
).replaceAll("\\", "/");
const SEARCH_RESPONSE_TYPE_FILE_PATH = resolve(
  PACKAGE_ROOT,
  "src/versions/2026-01-01/2026-01-01.search-response.schema.generated"
).replaceAll("\\", "/");
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.map((directoryPath) =>
      rm(directoryPath, { force: true, recursive: true })
    )
  );
  temporaryDirectories.length = 0;
});

describe("SchemaPath type-level authoring", () => {
  it("accepts valid nested object paths", async () => {
    const result = await runTypeCheck(`
import type { SchemaPath } from "${SCHEMA_PATH_FILE_PATH}";

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

const pathA: SchemaPath<RequestShape> = "modalities.animal";
const pathB: SchemaPath<RequestShape> = "publics.age.max";
void pathA;
void pathB;
`);

    expect(result.success).toBe(true);
    expect(result.output).toBe("");
  });

  it("rejects invalid paths at compile time", async () => {
    const result = await runTypeCheck(`
import type { SchemaPath } from "${SCHEMA_PATH_FILE_PATH}";

type RequestShape = {
  modalities?: {
    animal?: boolean;
  };
};

const invalidPath: SchemaPath<RequestShape> = "modalities.unknown";
void invalidPath;
`);

    expect(result.success).toBe(false);
    expect(result.output).toContain("modalities.unknown");
  });

  it("accepts implicit array item traversal like places._id", async () => {
    const result = await runTypeCheck(`
import type { SchemaPath } from "${SCHEMA_PATH_FILE_PATH}";
import type { V20260101SearchResponse } from "${SEARCH_RESPONSE_TYPE_FILE_PATH}";

const path: SchemaPath<V20260101SearchResponse> = "places._id";
void path;
`);

    expect(result.success).toBe(true);
  });

  it("accepts rename authoring against generated schema types", async () => {
    const result = await runTypeCheck(`
import { rename } from "${DSL_FILE_PATH}";
import searchRequestSchema from "${SEARCH_REQUEST_SCHEMA_FILE_PATH}";

rename<typeof searchRequestSchema>({
  from: "animal",
  payloadPath: "modalities",
  to: "acceptsPets",
});
`);

    expect(result.success).toBe(true);
    expect(result.output).toBe("");
  });

  it("rejects invalid rename fields against generated schema types", async () => {
    const result = await runTypeCheck(`
import { rename } from "${DSL_FILE_PATH}";
import searchRequestSchema from "${SEARCH_REQUEST_SCHEMA_FILE_PATH}";

rename<typeof searchRequestSchema>({
  from: "unknownField",
  payloadPath: "modalities",
  to: "acceptsPets",
});
`);

    expect(result.success).toBe(false);
    expect(result.output).toContain("unknownField");
  });

  it("rejects rename payload paths that do not target objects", async () => {
    const result = await runTypeCheck(`
import { rename } from "${DSL_FILE_PATH}";
import searchRequestSchema from "${SEARCH_REQUEST_SCHEMA_FILE_PATH}";

rename<typeof searchRequestSchema>({
  from: "animal",
  payloadPath: "categories",
  to: "acceptsPets",
});
`);

    expect(result.success).toBe(false);
    expect(result.output).toContain("categories");
  });
});

async function runTypeCheck(sourceCode: string): Promise<{
  success: boolean;
  output: string;
}> {
  const tempDirectoryPath = await mkdtemp(join(tmpdir(), "schema-path-spec-"));
  temporaryDirectories.push(tempDirectoryPath);

  const sourceFilePath = join(tempDirectoryPath, "schema-path-typecheck.ts");
  await writeFile(sourceFilePath, sourceCode, "utf-8");

  const compilerOptions: ts.CompilerOptions = {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2021,
  };

  const compilerHost = ts.createCompilerHost(compilerOptions, true);
  compilerHost.getCurrentDirectory = () => PACKAGE_ROOT;

  const program = ts.createProgram(
    [sourceFilePath],
    compilerOptions,
    compilerHost
  );
  const diagnostics = ts.getPreEmitDiagnostics(program);

  return {
    output: formatDiagnostics(diagnostics),
    success: diagnostics.length === 0,
  };
}

function formatDiagnostics(diagnostics: readonly ts.Diagnostic[]): string {
  if (diagnostics.length === 0) {
    return "";
  }

  return diagnostics
    .map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      const location =
        diagnostic.file && diagnostic.start !== undefined
          ? `${diagnostic.file.fileName}:${diagnostic.start}`
          : "";

      return [location, message].filter(Boolean).join(" - ");
    })
    .join("\n");
}
