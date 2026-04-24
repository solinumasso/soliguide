import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  defineVersion,
  remove,
  rename,
  replaceSchema,
  resource,
  schema,
} from "./index";

describe("version-definition DSL validation", () => {
  it("rejects duplicate resource names", () => {
    expect(() =>
      defineVersion({
        version: "2026-04-17",
        baseVersion: "2026-01-01",
        resources: [
          resource("sample", [remove<any>({ payloadPath: "root.field" })]),
          resource("sample", [remove<any>({ payloadPath: "root.otherField" })]),
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
          resource("sample", [
            remove<any>({ payloadPath: "root.field" }),
            remove<any>({ payloadPath: "root.field" }),
          ]),
        ],
      })
    ).toThrow("Conflicting ordered edits");
  });

  it("validates change payloads when helpers are called", () => {
    expect(() =>
      rename<any>({
        payloadPath: "root",
        from: "invalid-name",
        to: "nextField",
      })
    ).toThrow('Invalid field token "invalid-name"');

    expect(() =>
      replaceSchema<any>({
        payloadPath: "root..field",
        schema: schema(z.string()),
      })
    ).toThrow('invalid payloadPath segment ""');
  });
});
