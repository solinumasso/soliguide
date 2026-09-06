import { CountryCodes, SOLIGUIDE_COUNTRIES } from "@soliguide/common";

import { countryDto } from "../country.dto";
import {
  ALL_INJECTIONS,
  ARRAY_SMUGGLING,
  MONGO_INJECTIONS,
  NODE_INJECTIONS,
} from "../../tests/injection-payloads";
import { expectAccepted, expectRejected, runDto } from "../../tests/run-dto";

describe("countryDto", () => {
  describe("valid input", () => {
    it.each(SOLIGUIDE_COUNTRIES)("should accept %s", async (country) => {
      expectAccepted(await runDto(countryDto, { body: { country } }));
    });

    it("should keep the country in the validated body", async () => {
      const result = await runDto(countryDto, {
        body: { country: CountryCodes.FR },
      });

      expect(result.data.country).toBe(CountryCodes.FR);
    });
  });

  describe("invalid input", () => {
    it("should refuse a country outside the Soliguide list", async () => {
      expectRejected(await runDto(countryDto, { body: { country: "US" } }));
    });

    it("should refuse a missing country", async () => {
      expectRejected(await runDto(countryDto, { body: {} }));
    });

    it("should refuse a country that only differs by case", async () => {
      expectRejected(await runDto(countryDto, { body: { country: "FR" } }));
    });
  });

  describe("Mongo operator injection", () => {
    it.each(MONGO_INJECTIONS)("should refuse $label", async ({ value }) => {
      const result = await runDto(countryDto, { body: { country: value } });

      expectRejected(result);
      expect(result.data.country).toBeUndefined();
    });
  });

  describe("array smuggling", () => {
    it.each(ARRAY_SMUGGLING)("should refuse $label", async ({ value }) => {
      const result = await runDto(countryDto, { body: { country: value } });

      expectRejected(result);
      expect(result.data.country).toBeUndefined();
    });
  });

  describe("runtime hostile values", () => {
    it.each(NODE_INJECTIONS)("should refuse $label", async ({ value }) => {
      expectRejected(await runDto(countryDto, { body: { country: value } }));
    });
  });

  it("should never let a value it refused reach the validated body", async () => {
    for (const { value } of ALL_INJECTIONS) {
      const result = await runDto(countryDto, { body: { country: value } });

      expect(result.thrown).toBeUndefined();
      expect(result.data.country).toBeUndefined();
    }
  });
});
