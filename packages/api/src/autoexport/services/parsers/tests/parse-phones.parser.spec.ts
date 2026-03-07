import { Phone, SupportedLanguagesCode, CountryCodes } from "@soliguide/common";
import { parsePhones } from "..";

describe("Get complete address for place ", () => {
  it("No phone", () => {
    expect(parsePhones(SupportedLanguagesCode.EN, [])).toEqual(
      "No phone number given"
    );
  });

  it("Phones with label", () => {
    const phones: Phone[] = [
      {
        label: "Phone 1 ",
        phoneNumber: "09 09 09 09 09",
        isSpecialPhoneNumber: false,
        countryCode: CountryCodes.FR,
      },
      {
        label: "Phone number 2",
        phoneNumber: "06.10.20.22.22 ",
        isSpecialPhoneNumber: false,
        countryCode: CountryCodes.FR,
      },
    ];
    expect(parsePhones(SupportedLanguagesCode.EN, phones)).toEqual(
      "Phone 1: 09 09 09 09 09\nPhone number 2: 06 10 20 22 22"
    );
  });
  it("Phones with label", () => {
    const phones: Phone[] = [
      {
        label: "Phone number One",
        phoneNumber: "+ 33 09 09 09 09 09",
        isSpecialPhoneNumber: false,
        countryCode: CountryCodes.FR,
      },
    ];
    expect(parsePhones(SupportedLanguagesCode.EN, phones)).toEqual(
      "Phone number One: 09 09 09 09 09"
    );
  });
});
