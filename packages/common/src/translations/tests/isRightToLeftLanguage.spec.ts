import { SupportedLanguagesCode } from "../enums";
import { isRightToLeftLanguage } from "../functions/isRightToLeftLanguage";

describe("isRightToLeftLanguage", () => {
  test.each([
    SupportedLanguagesCode.AR,
    SupportedLanguagesCode.FA,
    SupportedLanguagesCode.PS,
  ])("detects %s as right to left", (lang) => {
    expect(isRightToLeftLanguage(lang)).toBe(true);
  });

  test.each([
    SupportedLanguagesCode.FR,
    SupportedLanguagesCode.CA,
    SupportedLanguagesCode.ES,
    SupportedLanguagesCode.EN,
    SupportedLanguagesCode.UK,
    SupportedLanguagesCode.RU,
    SupportedLanguagesCode.KA,
    SupportedLanguagesCode.RO,
    SupportedLanguagesCode.PT,
  ])("detects %s as left to right", (lang) => {
    expect(isRightToLeftLanguage(lang)).toBe(false);
  });

  test.each([
    ["an unknown language", "xx"],
    ["an empty string", ""],
  ])("returns false for %s", (_label, lang) => {
    expect(isRightToLeftLanguage(lang)).toBe(false);
  });
});
