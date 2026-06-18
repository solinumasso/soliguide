import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { apiReference } from "@scalar/nestjs-api-reference";
import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";
import { cwd } from "process";

const VERSION_DIRECTORY_NAME_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type VersionedOpenApiSpec = {
  content: string;
  isDefault: boolean;
  title: string;
  url: string;
};

export async function setupOpenApi(app: NestFastifyApplication) {
  const versionedOpenApiSpecs = await loadVersionedOpenApiSpecifications();
  const fastify = app.getHttpAdapter().getInstance();

  for (const spec of versionedOpenApiSpecs) {
    fastify.get(spec.url, async (_, reply) => {
      reply.type("application/json; charset=utf-8").send(spec.content);
    });
  }

  app.use(
    "/api/docs",
    apiReference({
      pageTitle: "Soliguide Public API Reference",
      sources: versionedOpenApiSpecs.map((spec) => ({
        default: spec.isDefault,
        title: spec.title,
        url: spec.url,
      })),
      withFastify: true,
    })
  );
}

async function loadVersionedOpenApiSpecifications(): Promise<
  VersionedOpenApiSpec[]
> {
  const versionsDirectory = resolve(cwd(), "src/versions");
  const directoryEntries = await readdir(versionsDirectory, {
    withFileTypes: true,
  });

  const versionNames = directoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((entryName) => VERSION_DIRECTORY_NAME_PATTERN.test(entryName))
    .sort((a, b) => b.localeCompare(a));

  const specs = await Promise.all(
    versionNames.map(async (versionName, index) => {
      const versionSpecPath = join(
        versionsDirectory,
        versionName,
        `${versionName}.openapi.generated.json`
      );

      const content = await readFile(versionSpecPath, "utf-8");

      return {
        content,
        isDefault: index === 0,
        title: versionName,
        url: `/openapi/${versionName}.json`,
      } satisfies VersionedOpenApiSpec;
    })
  );

  return specs;
}
