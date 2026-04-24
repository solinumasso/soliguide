import { resolve } from "node:path";

import { SchemaVersionGenerator } from "./schema-versioning/schema-version.generator";

function parseVersionFromArgs(args: string[]): string {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--version") {
      const nextArg = args[index + 1];
      if (!nextArg) {
        throw new Error("Missing value for --version");
      }
      return nextArg;
    }

    if (arg.startsWith("--version=")) {
      return arg.slice("--version=".length);
    }
  }

  throw new Error(
    "Missing required --version argument, expected: --version 2026-04-17"
  );
}

function parseSkipFormatAndLintFromArgs(args: string[]): boolean {
  return args.includes("--skip-format-lint");
}

Promise.resolve()
  .then(async () => {
    const args = process.argv.slice(2);
    const version = parseVersionFromArgs(args);
    const skipFormatAndLint = parseSkipFormatAndLintFromArgs(args);
    const packageRootDir = resolve(__dirname, "..", "..");

    const result = await new SchemaVersionGenerator().generate({
      formatAndLint: !skipFormatAndLint,
      packageRootDir,
      version,
    });

    return result;
  })
  .then((result) => {
    // eslint-disable-next-line no-console
    console.log(
      `Generated schema version in ${result.outputVersionDirectoryPath} (${result.generatedFiles.length} files)`
    );
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
