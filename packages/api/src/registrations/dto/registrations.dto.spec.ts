import { validationResult } from "express-validator";

import { CountryCodes, RegistrationScheme } from "@soliguide/common";

import { registrationsDto } from "./registrations.dto";

const VALID_SIRET = "13002526500013";

const run = async (body: Record<string, unknown>) => {
  const req = { body };
  for (const chain of registrationsDto) {
    await chain.run(req);
  }
  return { errors: validationResult(req).array(), body: req.body };
};

describe("registrationsDto", () => {
  it("should accept a scheme of the body's country and normalize it", async () => {
    const { errors, body } = await run({
      country: CountryCodes.FR,
      registrations: {
        [RegistrationScheme.SIRET]: { value: " 130 025 265 00013 " },
      },
    });
    expect(errors).toEqual([]);
    expect(body.registrations).toEqual({
      [RegistrationScheme.SIRET]: {
        value: VALID_SIRET,
        scope: expect.any(String),
      },
    });
  });

  it("should reject a scheme of another country", async () => {
    const { errors } = await run({
      country: CountryCodes.ES,
      registrations: { [RegistrationScheme.SIRET]: { value: VALID_SIRET } },
    });
    expect(errors.map((e) => e.msg)).toEqual([
      "REGISTRATION_SCHEME_NOT_ALLOWED",
    ]);
  });

  it.each([
    undefined,
    null,
    42,
    ["FR"],
    { FR: true },
    "constructor",
    "__proto__",
    "toString",
  ])(
    "should reject every scheme without throwing when country is %p",
    async (country) => {
      const { errors } = await run({
        country,
        registrations: { [RegistrationScheme.SIRET]: { value: VALID_SIRET } },
      });
      expect(errors.map((e) => e.msg)).toEqual([
        "REGISTRATION_SCHEME_NOT_ALLOWED",
      ]);
    }
  );

  it("should leave the body untouched when registrations is absent", async () => {
    const { errors, body } = await run({ country: "constructor" });
    expect(errors).toEqual([]);
    expect(body).not.toHaveProperty("registrations");
  });
});
