import { SupportedLanguagesCode } from "@soliguide/common";

export const LANGUAGE_FOR_PRACTICAL_FILES: Record<
  SupportedLanguagesCode,
  string
> = {
  [SupportedLanguagesCode.FR]: SupportedLanguagesCode.FR,
  [SupportedLanguagesCode.AR]: SupportedLanguagesCode.AR,
  [SupportedLanguagesCode.CA]: SupportedLanguagesCode.ES,
  [SupportedLanguagesCode.EN]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.ES]: SupportedLanguagesCode.ES,
  [SupportedLanguagesCode.FA]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.KA]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.PS]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.PT]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.RO]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.RU]: `${SupportedLanguagesCode.EN}-us`,
  [SupportedLanguagesCode.UK]: `${SupportedLanguagesCode.EN}-us`,
};
