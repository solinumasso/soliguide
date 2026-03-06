import { CountryISO } from "ngx-intl-tel-input";
import { setFormPhone } from "./phoneUtils";
import { THEME_CONFIGURATION } from "../../../../../models";

describe("Telephones for forms", () => {
  it("❌ Setformphone with a bad number", () => {
    expect(
      setFormPhone({ countryCode: CountryISO.UnitedStates, phoneNumber: "" })
    ).toEqual({ countryCode: THEME_CONFIGURATION.country, number: "" });

    expect(
      setFormPhone({
        countryCode: CountryISO.UnitedStates,
        phoneNumber: "NUMBER_FAIL",
      })
    ).toEqual({ countryCode: THEME_CONFIGURATION.country, number: "" });

    expect(
      setFormPhone({
        countryCode: CountryISO.France,
        phoneNumber: "2126063600",
      })
    ).toEqual({ countryCode: THEME_CONFIGURATION.country, number: "" });
  });

  it("✅ Setformphone with a right number", () => {
    expect(
      setFormPhone({
        countryCode: CountryISO.UnitedStates,
        phoneNumber: " 212-606-3600",
      })
    ).toEqual({ countryCode: "us", number: "2126063600" });

    expect(
      setFormPhone({
        countryCode: CountryISO.UnitedStates,
        phoneNumber: " 212 606 3600",
      })
    ).toEqual({ countryCode: "us", number: "2126063600" });

    expect(
      setFormPhone({
        countryCode: CountryISO.France,
        phoneNumber: "6 06-060606",
      })
    ).toEqual({ countryCode: "fr", number: "606060606" });

    expect(
      setFormPhone({
        countryCode: CountryISO.France,
        phoneNumber: "0606060606",
      })
    ).toEqual({ countryCode: "fr", number: "606060606" });

    // Mayotte
    expect(
      setFormPhone({
        countryCode: CountryISO.Mayotte,
        phoneNumber: "269 63 50 00",
      })
    ).toEqual({ countryCode: "yt", number: "269635000" });

    // Réunion
    // Même indicatif que Mayotte + 262
    expect(
      setFormPhone({
        countryCode: CountryISO.Réunion,
        phoneNumber: " 262 39/ 50.50",
      })
    ).toEqual({ countryCode: "re", number: "262395050" });

    expect(
      setFormPhone({
        countryCode: CountryISO.Guadeloupe,
        phoneNumber: "590 99 39 00",
      })
    ).toEqual({ countryCode: "gp", number: "590993900" });

    expect(
      setFormPhone({
        countryCode: CountryISO.Martinique,
        phoneNumber: "05 96 66 68 88",
      })
    ).toEqual({ countryCode: "mq", number: "596666888" });

    expect(
      setFormPhone({
        countryCode: CountryISO.FrenchGuiana,
        phoneNumber: "594--39.70.70",
      })
    ).toEqual({ countryCode: "gf", number: "594397070" });
  });
});
