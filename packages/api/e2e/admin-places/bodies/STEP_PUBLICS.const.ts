import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  PublicsAdministrative,
  PublicsGender,
  PublicsOther,
  SupportedLanguagesCode,
  WelcomedPublics,
} from "@soliguide/common";

export const STEP_PUBLICS_OK = {
  EXCLUSIVE: {
    languages: [SupportedLanguagesCode.FR, "lsf"],
    publics: {
      accueil: WelcomedPublics.EXCLUSIVE,
      administrative: [PublicsAdministrative.regular],
      age: { max: 99, min: 18 },
      description: "Adultes masculins",
      familialle: FAMILY_DEFAULT_VALUES,
      gender: [PublicsGender.men],
      other: [PublicsOther.lgbt, PublicsOther.hiv, PublicsOther.prostitution],
    },
  },
  UNCONDITIONAL: {
    languages: [SupportedLanguagesCode.FR, "lsf"],
    publics: {
      accueil: WelcomedPublics.UNCONDITIONAL,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: { max: 99, min: 0 },
      description: "Tout le monde est le bienvenu",
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    },
  },
  PREFERENTIAL: {
    languages: [
      SupportedLanguagesCode.FR,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.RU,
      SupportedLanguagesCode.AR,
      "lsf",
    ],
    publics: {
      accueil: WelcomedPublics.PREFERENTIAL,
      administrative: [
        PublicsAdministrative.undocumented,
        PublicsAdministrative.refugee,
      ],
      age: { max: 99, min: 18 },
      description: "Jeunes femmes en difficulté, majeures uniquement",
      familialle: FAMILY_DEFAULT_VALUES,
      gender: [PublicsGender.women],
      other: [],
    },
  },
};
