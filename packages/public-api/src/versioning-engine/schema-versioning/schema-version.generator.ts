import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";

import { Project } from "ts-morph";

import { pruneUnusedDeclarations } from "./cleanup";
import { compactVersion, SchemaAstEditor } from "./schema-editor";
import { VersionSourceParser } from "./source-parser";

const VERSION_DIR_TOKEN_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const SCHEMA_FILE_SUFFIX = ".schema.generated.ts";

export interface GenerateSchemaVersionOptions {
  version: string;
  packageRootDir: string;
  formatAndLint?: boolean;
}

export interface GenerateSchemaVersionResult {
  generatedFiles: string[];
  outputVersionDirectoryPath: string;
}

export class SchemaVersionGenerator {
  public async generate(
    options: GenerateSchemaVersionOptions
  ): Promise<GenerateSchemaVersionResult> {
    const packageRootDir = resolve(options.packageRootDir);
    const tsConfigFilePath = resolve(packageRootDir, "tsconfig.json");
    const versionsRootDir = resolve(packageRootDir, "src", "versions");
    const versionSourceParser = new VersionSourceParser();

    const parsedVersionDefinition = versionSourceParser.parseVersionDefinition({
      tsConfigFilePath,
      version: options.version,
      versionsRootDir,
    });

    const sourceVersionDirectoryPath = resolve(
      versionsRootDir,
      parsedVersionDefinition.baseVersion
    );
    const targetVersionDirectoryPath = resolve(
      versionsRootDir,
      parsedVersionDefinition.version
    );

    if (!existsSync(sourceVersionDirectoryPath)) {
      throw new Error(
        `Missing base version directory ${sourceVersionDirectoryPath}`
      );
    }

    await mkdir(targetVersionDirectoryPath, { recursive: true });

    const copiedSchemaFilePaths = await this.copyBaseSchemaFiles({
      baseVersion: parsedVersionDefinition.baseVersion,
      sourceVersionDirectoryPath,
      targetVersion: parsedVersionDefinition.version,
      targetVersionDirectoryPath,
    });

    const targetSchemaFilePathByResourceName = new Map<string, string>();

    for (const copiedSchemaFilePath of copiedSchemaFilePaths) {
      const resourceName = readResourceNameFromSchemaFileName(
        parsedVersionDefinition.version,
        copiedSchemaFilePath
      );

      targetSchemaFilePathByResourceName.set(
        resourceName,
        copiedSchemaFilePath
      );
    }

    for (const resource of parsedVersionDefinition.resources) {
      if (!targetSchemaFilePathByResourceName.has(resource.resourceName)) {
        throw new Error(
          `Missing base resource ${resource.resourceName} in version ${parsedVersionDefinition.baseVersion}`
        );
      }
    }

    const project = new Project({
      tsConfigFilePath,
    });
    const schemaAstEditor = new SchemaAstEditor(project);

    for (const copiedSchemaFilePath of copiedSchemaFilePaths) {
      const resourceName = readResourceNameFromSchemaFileName(
        parsedVersionDefinition.version,
        copiedSchemaFilePath
      );
      const resourceDefinition = parsedVersionDefinition.resources.find(
        (resource) => resource.resourceName === resourceName
      );

      const sourceFile = project.addSourceFileAtPath(copiedSchemaFilePath);

      if (resourceDefinition && resourceDefinition.changes.length > 0) {
        schemaAstEditor.applyChanges({
          changes: resourceDefinition.changes,
          sourceFilePath: copiedSchemaFilePath,
        });
      }

      schemaAstEditor.replaceVersionTokens(
        sourceFile,
        parsedVersionDefinition.baseVersion,
        parsedVersionDefinition.version
      );
      pruneUnusedDeclarations(sourceFile);
      schemaAstEditor.ensureMainSchemaFooter(sourceFile);
    }

    await project.save();

    const generatedRegistryPath = await this.rebuildRegistryFile({
      baseVersion: parsedVersionDefinition.baseVersion,
      sourceVersionDirectoryPath,
      targetVersion: parsedVersionDefinition.version,
      targetVersionDirectoryPath,
    });

    const generatedVersionsIndexPath = await this.rebuildVersionsIndexFile(
      versionsRootDir
    );

    const generatedFilePaths = [
      ...copiedSchemaFilePaths,
      generatedRegistryPath,
      generatedVersionsIndexPath,
    ];

    if (options.formatAndLint !== false) {
      this.runFormatterAndLinter(packageRootDir, generatedFilePaths);
    }

    return {
      generatedFiles: generatedFilePaths,
      outputVersionDirectoryPath: targetVersionDirectoryPath,
    };
  }

  private async copyBaseSchemaFiles(options: {
    sourceVersionDirectoryPath: string;
    targetVersionDirectoryPath: string;
    baseVersion: string;
    targetVersion: string;
  }): Promise<string[]> {
    const sourceFiles = await readdir(options.sourceVersionDirectoryPath);
    const sourceSchemaFiles = sourceFiles.filter(
      (fileName) =>
        fileName.startsWith(`${options.baseVersion}.`) &&
        fileName.endsWith(SCHEMA_FILE_SUFFIX)
    );

    if (sourceSchemaFiles.length === 0) {
      throw new Error(
        `No base ${SCHEMA_FILE_SUFFIX} files found in ${options.sourceVersionDirectoryPath}`
      );
    }

    const copiedSchemaFilePaths: string[] = [];

    for (const sourceSchemaFileName of sourceSchemaFiles) {
      const resourceName = readResourceNameFromSchemaFileName(
        options.baseVersion,
        sourceSchemaFileName
      );
      const targetSchemaFileName = `${options.targetVersion}.${resourceName}${SCHEMA_FILE_SUFFIX}`;

      const sourceSchemaFilePath = resolve(
        options.sourceVersionDirectoryPath,
        sourceSchemaFileName
      );
      const targetSchemaFilePath = resolve(
        options.targetVersionDirectoryPath,
        targetSchemaFileName
      );

      await copyFile(sourceSchemaFilePath, targetSchemaFilePath);
      copiedSchemaFilePaths.push(targetSchemaFilePath);
    }

    copiedSchemaFilePaths.sort((left, right) => left.localeCompare(right));

    return copiedSchemaFilePaths;
  }

  private async rebuildRegistryFile(options: {
    sourceVersionDirectoryPath: string;
    targetVersionDirectoryPath: string;
    baseVersion: string;
    targetVersion: string;
  }): Promise<string> {
    const sourceRegistryPath = resolve(
      options.sourceVersionDirectoryPath,
      "open-api.registry.ts"
    );
    const targetRegistryPath = resolve(
      options.targetVersionDirectoryPath,
      "open-api.registry.ts"
    );

    if (!existsSync(sourceRegistryPath)) {
      throw new Error(`Missing base registry file ${sourceRegistryPath}`);
    }

    const sourceRegistryText = await readFile(sourceRegistryPath, "utf-8");
    const rewrittenRegistryText = replaceVersionTokensInText(
      sourceRegistryText,
      options.baseVersion,
      options.targetVersion
    );

    await writeFile(targetRegistryPath, rewrittenRegistryText, "utf-8");

    return targetRegistryPath;
  }

  private async rebuildVersionsIndexFile(
    versionsRootDir: string
  ): Promise<string> {
    const versionsIndexPath = resolve(versionsRootDir, "index.ts");
    const directories = await readdir(versionsRootDir, {
      withFileTypes: true,
    });

    const availableVersionDirectories: string[] = [];

    for (const directoryEntry of directories) {
      if (!directoryEntry.isDirectory()) {
        continue;
      }

      const versionDirectoryName = directoryEntry.name;
      if (!VERSION_DIR_TOKEN_REGEX.test(versionDirectoryName)) {
        continue;
      }

      const registryFilePath = resolve(
        versionsRootDir,
        versionDirectoryName,
        "open-api.registry.ts"
      );

      if (!existsSync(registryFilePath)) {
        continue;
      }

      const registryStats = await stat(registryFilePath);
      if (!registryStats.isFile()) {
        continue;
      }

      availableVersionDirectories.push(versionDirectoryName);
    }

    availableVersionDirectories.sort((left, right) =>
      left.localeCompare(right)
    );

    const importLines = availableVersionDirectories.map((version) => {
      const compact = compactVersion(version);
      return `import v${compact}Registry from "./${version}/open-api.registry";`;
    });

    const registryEntries = availableVersionDirectories.map((version) => {
      const compact = compactVersion(version);
      return `  v${compact}: v${compact}Registry,`;
    });

    const indexFileContent = [
      'import { VersionRegistry } from "../versioning-engine/version-registry";',
      ...importLines,
      "",
      "export const versionRegistry: Record<string, VersionRegistry> = {",
      ...registryEntries,
      "};",
      "",
    ].join("\n");

    await writeFile(versionsIndexPath, indexFileContent, "utf-8");

    return versionsIndexPath;
  }

  private runFormatterAndLinter(
    packageRootDir: string,
    generatedFilePaths: string[]
  ): void {
    const prettierPackageJsonPath = require.resolve("prettier/package.json", {
      paths: [packageRootDir],
    });
    const eslintPackageJsonPath = require.resolve("eslint/package.json", {
      paths: [packageRootDir],
    });
    const prettierBinPath = resolve(
      dirname(prettierPackageJsonPath),
      "bin-prettier.js"
    );
    const eslintBinPath = resolve(
      dirname(eslintPackageJsonPath),
      "bin",
      "eslint.js"
    );

    execFileSync(
      process.execPath,
      [prettierBinPath, "--cache", "-w", ...generatedFilePaths],
      {
        cwd: packageRootDir,
        stdio: "pipe",
      }
    );

    execFileSync(
      process.execPath,
      [eslintBinPath, "--cache", "--fix", ...generatedFilePaths],
      {
        cwd: packageRootDir,
        env: {
          ...process.env,
          ESLINT_USE_FLAT_CONFIG: "false",
        },
        stdio: "pipe",
      }
    );
  }
}

function readResourceNameFromSchemaFileName(
  version: string,
  filePathOrName: string
): string {
  const fileName = filePathOrName.split("/").at(-1)?.split("\\").at(-1);
  if (!fileName) {
    throw new Error(`Invalid schema file path ${filePathOrName}`);
  }

  const expectedPrefix = `${version}.`;
  const expectedSuffix = SCHEMA_FILE_SUFFIX;

  if (
    !fileName.startsWith(expectedPrefix) ||
    !fileName.endsWith(expectedSuffix)
  ) {
    throw new Error(
      `Schema file ${fileName} does not match expected pattern ${version}.*${SCHEMA_FILE_SUFFIX}`
    );
  }

  return fileName.slice(
    expectedPrefix.length,
    fileName.length - expectedSuffix.length
  );
}

function replaceVersionTokensInText(
  sourceText: string,
  baseVersion: string,
  targetVersion: string
): string {
  const baseCompact = compactVersion(baseVersion);
  const targetCompact = compactVersion(targetVersion);

  let rewrittenText = sourceText;

  if (baseVersion !== targetVersion) {
    rewrittenText = rewrittenText.split(baseVersion).join(targetVersion);
  }

  if (baseCompact !== targetCompact) {
    rewrittenText = rewrittenText.split(baseCompact).join(targetCompact);
  }

  return rewrittenText;
}
