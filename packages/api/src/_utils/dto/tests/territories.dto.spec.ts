import { CountryCodes, UserStatus } from "@soliguide/common";

import { territoriesDto } from "../territories.dto";
import { NON_ARRAY_INJECTIONS } from "../../tests/injection-payloads";
import { expectAccepted, expectRejected, runDto } from "../../tests/run-dto";

const adminContext = {
  user: { status: UserStatus.ADMIN_SOLIGUIDE, areas: {} },
};

const run = (body: Record<string, unknown>) =>
  runDto(territoriesDto, { body, context: adminContext });

describe("territoriesDto", () => {
  it("should accept a list of real departments", async () => {
    const result = await run({
      country: CountryCodes.FR,
      territories: ["75", "93"],
    });

    expectAccepted(result);
    expect(result.data.territories).toEqual(["75", "93"]);
  });

  it("should remove the duplicates", async () => {
    const result = await run({
      country: CountryCodes.FR,
      territories: ["75", "75", "93"],
    });

    expectAccepted(result);
    expect(result.data.territories).toEqual(["75", "93"]);
  });

  it("should accept an absent list", async () => {
    expectAccepted(await run({ country: CountryCodes.FR }));
  });

  it("should refuse a department that does not exist in the country", async () => {
    expectRejected(
      await run({ country: CountryCodes.FR, territories: ["99"] })
    );
  });

  it("should refuse a list sent for a country the user did not declare", async () => {
    expectRejected(await run({ territories: ["75"] }));
  });

  describe("type confusion", () => {
    it.each(NON_ARRAY_INJECTIONS)(
      "should refuse the list $label without answering 500",
      async ({ value }) => {
        const result = await run({
          country: CountryCodes.FR,
          territories: value,
        });

        // The deduplication spreads the value into a Set. Running it on anything
        // that is not iterable throws out of the sanitizer, which express-validator
        // does not catch, so the route would answer 500 instead of 400.
        expect(result.thrown).toBeUndefined();
        expect(result.data.territories).not.toEqual(
          expect.arrayContaining([expect.anything()])
        );
      }
    );

    it.each([
      { label: "an object item", value: [{ $ne: null }] },
      { label: "a nested array item", value: [["75"]] },
      { label: "a numeric item", value: [75] },
    ])("should refuse a list containing $label", async ({ value }) => {
      expectRejected(
        await run({ country: CountryCodes.FR, territories: value })
      );
    });
  });

  describe("areas", () => {
    it("should accept and deduplicate the departments of an area", async () => {
      const result = await run({
        country: CountryCodes.FR,
        areas: { fr: { departments: ["75", "75"] } },
      });

      expectAccepted(result);
      expect(result.data).toMatchObject({
        areas: { fr: { departments: ["75"] } },
      });
    });

    it.each(NON_ARRAY_INJECTIONS)(
      "should refuse the departments $label without answering 500",
      async ({ value }) => {
        const result = await run({
          country: CountryCodes.FR,
          areas: { fr: { departments: value } },
        });

        expect(result.thrown).toBeUndefined();
      }
    );
  });
});
