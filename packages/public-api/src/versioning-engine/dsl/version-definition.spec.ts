import { describe, expect, it } from "vitest";
import { z } from "zod";
import { defineVersion, resource } from "./version-definition";
import {
  remove,
  rename,
  replaceSchema,
  schema,
} from "./changes/version-change";

type SampleSchema = {
  first?: string;
  second?: string;
  word?: string;
  root?: {
    field?: string;
    legacyField?: string;
    otherField?: string;
    first?: string;
    second?: string;
  };
};

type RuntimeValidationSchema = Omit<SampleSchema, "root"> & {
  root?: Record<string, unknown>;
};

type LooseSchema = Record<string, unknown>;

describe("version-definition DSL validation", () => {
  it("rejects duplicate resource names", () => {
    expect(() =>
      defineVersion({
        version: "2026-04-17",
        baseVersion: "2026-01-01",
        resources: [
          resource<SampleSchema>("sample", {
            kind: "request",
            changes: [remove<SampleSchema>({ payloadPath: "root.field" })],
          }),
          resource<SampleSchema>("sample", {
            kind: "request",
            changes: [
              remove<SampleSchema>({ payloadPath: "root.otherField" }),
            ],
          }),
        ],
      })
    ).toThrow("Duplicate resourceName");
  });

  it("rejects conflicting ordered changes inside a resource", () => {
    expect(() =>
      defineVersion({
        version: "2026-04-17",
        baseVersion: "2026-01-01",
        resources: [
          resource<SampleSchema>("sample", {
            kind: "request",
            changes: [
              remove<SampleSchema>({ payloadPath: "root.field" }),
              remove<SampleSchema>({ payloadPath: "root.field" }),
            ],
          }),
        ],
      })
    ).toThrow("Conflicting ordered edits");
  });

  it("allows schema replacement before a later base-path rename", () => {
    const definition = defineVersion({
      version: "2026-04-17",
      baseVersion: "2026-01-01",
      resources: [
        resource<SampleSchema>("sample", {
          kind: "request",
          changes: [
            replaceSchema<SampleSchema>({
              payloadPath: "root.legacyField",
              schema: schema(z.string()),
            }),
            rename<SampleSchema>({
              payloadPath: "root",
              from: "legacyField",
              to: "nextField",
            }),
          ],
        }),
      ],
    });

    expect(definition.resources[0].changes).toHaveLength(2);
  });

  it("rejects duplicate produced target paths", () => {
    expect(() =>
      defineVersion({
        version: "2026-04-17",
        baseVersion: "2026-01-01",
        resources: [
          resource<SampleSchema>("sample", {
            kind: "request",
            changes: [
              rename<SampleSchema>({
                payloadPath: "root",
                from: "first",
                to: "sameTarget",
              }),
              rename<SampleSchema>({
                payloadPath: "root",
                from: "second",
                to: "sameTarget",
              }),
            ],
          }),
        ],
      })
    ).toThrow("Conflicting ordered edits");
  });

  it("uses clean conflict paths for root object edits", () => {
    expect(() =>
      defineVersion({
        version: "2026-04-17",
        baseVersion: "2026-01-01",
        resources: [
          resource<SampleSchema>("sample", {
            kind: "request",
            changes: [
              rename<SampleSchema>({
                payloadPath: "",
                from: "first",
                to: "sameTarget",
              }),
              rename<SampleSchema>({
                payloadPath: "",
                from: "second",
                to: "sameTarget",
              }),
            ],
          }),
        ],
      })
    ).toThrow("on path sameTarget");
  });

  it("validates change payloads when helpers are called", () => {
    expect(() =>
      rename<SampleSchema>({
        payloadPath: "",
        from: "word",
        to: "searchText",
      })
    ).not.toThrow();

    expect(() =>
      rename<RuntimeValidationSchema>({
        payloadPath: "root",
        from: "invalid-name",
        to: "nextField",
      })
    ).toThrow('Invalid field token "invalid-name"');

    expect(() =>
      replaceSchema<LooseSchema>({
        payloadPath: "root..field",
        schema: schema(z.string()),
      })
    ).toThrow('invalid payloadPath segment ""');
  });

  it("supports resource-scoped change helpers", () => {
    const definition = defineVersion({
      version: "2026-04-17",
      baseVersion: "2026-01-01",
      resources: [
        resource<{ root?: { field?: string } }>("sample", {
          kind: "request",
          changes: ({ remove }) => [remove({ payloadPath: "root.field" })],
        }),
      ],
    });

    expect(definition.resources[0].changes).toHaveLength(1);
    expect(definition.resources[0].changes[0]).toMatchObject({
      type: "remove",
      payload: {
        payloadPath: "root.field",
      },
    });
  });

  it("supports resource options and grouped patch changes", () => {
    class SampleContextProvider {
      getContext() {
        return {};
      }
    }

    const definition = defineVersion({
      version: "2026-04-17",
      baseVersion: "2026-01-01",
      resources: [
        resource<{ root?: { field?: string } }>("sample", {
          kind: "response",
          contextProvider: SampleContextProvider,
          changes: ({ patch, remove }) => [
            patch({
              title: "Remove field with intent",
              payloadPath: "",
              changes: [remove({ payloadPath: "root.field" })],
              downgrade: (payload) => payload,
            }),
          ],
        }),
      ],
    });

    expect(definition.resources[0]).toMatchObject({
      contextProvider: SampleContextProvider,
      kind: "response",
      resourceName: "sample",
    });
    expect(definition.resources[0].changes[0]).toMatchObject({
      payload: {
        title: "Remove field with intent",
      },
      type: "patch",
    });
  });
});
