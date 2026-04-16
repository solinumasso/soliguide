import { resolve } from "node:path";

import { versionRegistry } from "../versions";
import { buildProductionBaseOpenApiDocument } from "./open-api.base-document.provider";
import { OpenApiGenerator } from "./open-api.generator";

function parseVersionFromArgs(args: string[]): string {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--version") {
      const next = args[index + 1];
      if (!next) {
        throw new Error("Missing value for --version");
      }
      return next;
    }

    if (arg.startsWith("--version=")) {
      return arg.slice("--version=".length);
    }
  }

  throw new Error(
    "Missing required --version argument, expected: --version 2026-01-01"
  );
}

Promise.resolve()
  .then(async () => {
    const version = parseVersionFromArgs(process.argv.slice(2));
    const outputPath = resolve(
      __dirname,
      "..",
      "versions",
      version,
      `${version}.openapi.generated.json`
    );

    return new OpenApiGenerator(
      buildProductionBaseOpenApiDocument
    ).generateVersionedOpenApi({
      outputPath,
      version,
      versionRegistryByVersion: versionRegistry,
    });
  })
  .then((outputPath) => {
    // eslint-disable-next-line no-console
    console.log(`Generated OpenAPI document: ${outputPath}`);
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
    }

    process.exitCode = 1;
  });
