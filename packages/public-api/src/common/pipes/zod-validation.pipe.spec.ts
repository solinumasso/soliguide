import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ZodValidationPipe } from "./zod-validation.pipe";

describe("ZodValidationPipe", () => {
  it("returns parsed value when payload is valid", () => {
    const schema = z.object({
      age: z.coerce.number().int().min(18),
    });
    const pipe = new ZodValidationPipe(schema, "INVALID_PAYLOAD");

    const result = pipe.transform({ age: "21" }, { type: "body" });

    expect(result).toEqual({ age: 21 });
  });

  it("throws bad request with field-level details when payload is invalid", () => {
    const schema = z.object({
      age: z.coerce.number().int().min(18),
      name: z.string().min(2),
    });
    const pipe = new ZodValidationPipe(schema, "INVALID_PAYLOAD");

    expect(() =>
      pipe.transform({ age: "16", name: "" }, { type: "body" })
    ).toThrowError(BadRequestException);

    try {
      pipe.transform({ age: "16", name: "" }, { type: "body" });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      const response = (error as BadRequestException).getResponse() as {
        details: {
          fieldErrors: Record<string, string[] | undefined>;
          formErrors: string[];
          issues: Array<{ path: string; message: string; code: string }>;
        };
        message: string;
      };

      expect(response.message).toBe("INVALID_PAYLOAD");
      expect(response.details.fieldErrors).toEqual({
        age: expect.any(Array),
        name: expect.any(Array),
      });
      expect(response.details.formErrors).toEqual([]);
      expect(response.details.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: "age",
            code: "too_small",
          }),
          expect.objectContaining({
            path: "name",
            code: "too_small",
          }),
        ])
      );
    }
  });
});
