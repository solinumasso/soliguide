import { readdirSync, statSync } from "fs";
import { join, relative, resolve } from "path";

import type { ValidationChain } from "express-validator";

export interface CollectedDto {
  /** Path relative to `src`, used as the test name */
  file: string;
  /** Exported name inside that file */
  name: string;
  chains: ValidationChain[];
  /** Every field the chains select, wildcards included */
  fields: string[];
}

const SRC = resolve(__dirname, "../..");

const isValidationChain = (value: unknown): value is ValidationChain =>
  typeof value === "function" &&
  typeof (value as { run?: unknown }).run === "function" &&
  typeof (value as { builder?: unknown }).builder === "object";

const asChains = (value: unknown): ValidationChain[] | null => {
  if (isValidationChain(value)) {
    return [value];
  }

  if (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(isValidationChain)
  ) {
    return value;
  }

  return null;
};

/**
 * A DTO is exported either as a chain, as an array of chains, or as a factory taking
 * the field path. A factory is called with a representative path so its chains can be
 * inspected like the others.
 */
const resolveExport = (value: unknown): ValidationChain[] | null => {
  const direct = asChains(value);

  if (direct) {
    return direct;
  }

  if (typeof value !== "function" || isValidationChain(value)) {
    return null;
  }

  for (const args of [[], ["conformanceField"], ["conformanceField", true]]) {
    try {
      const produced = asChains(
        (value as (...params: unknown[]) => unknown)(...args)
      );

      if (produced) {
        return produced;
      }
    } catch {
      // A factory that needs a different shape is covered by its own spec
    }
  }

  return null;
};

const listDtoFiles = (directory: string): string[] =>
  readdirSync(directory).flatMap((entry) => {
    const full = join(directory, entry);

    if (statSync(full).isDirectory()) {
      return entry === "node_modules" || entry === "tests"
        ? []
        : listDtoFiles(full);
    }

    return /\.dto\.ts$/.test(entry) && !/\.spec\.ts$/.test(entry) ? [full] : [];
  });

/**
 * Every DTO the API exposes, so a conformance spec can hold all of them to the same
 * contract instead of relying on each one having its own spec.
 */
export const collectDtos = (): CollectedDto[] => {
  const collected: CollectedDto[] = [];

  for (const file of listDtoFiles(SRC)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const moduleExports = require(file) as Record<string, unknown>;

    for (const [name, exported] of Object.entries(moduleExports)) {
      const chains = resolveExport(exported);

      if (!chains) {
        continue;
      }

      const fields = [
        ...new Set(
          chains.flatMap(
            (chain) =>
              (chain as unknown as { builder: { fields: string[] } }).builder
                .fields
          )
        ),
      ].filter((field) => field.length > 0);

      if (fields.length > 0) {
        collected.push({
          file: relative(SRC, file),
          name,
          chains,
          fields,
        });
      }
    }
  }

  return collected.sort((a, b) =>
    `${a.file}${a.name}`.localeCompare(`${b.file}${b.name}`)
  );
};

/**
 * Builds a request body where `field` carries `value`.
 * A wildcard becomes a single element, so `services_all.*.description` produces one
 * service and `areas.*.departments` one area.
 */
export const buildBodyForField = (
  field: string,
  value: unknown
): Record<string, unknown> => {
  const segments = field.split(".");
  const root: Record<string, unknown> = {};
  let cursor: Record<string, unknown> | unknown[] = root;

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const key = segment === "*" ? "0" : segment;
    const nextIsArray = segments[index + 1] === "*";
    const container = segment === "*" ? [] : {};

    if (Array.isArray(cursor)) {
      cursor[Number(key)] = isLast ? value : nextIsArray ? [] : container;
      cursor = cursor[Number(key)] as Record<string, unknown>;
      return;
    }

    cursor[key] = isLast ? value : nextIsArray ? [] : {};
    cursor = cursor[key] as Record<string, unknown>;
  });

  return root;
};
