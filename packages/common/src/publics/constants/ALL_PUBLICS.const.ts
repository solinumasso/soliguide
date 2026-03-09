import {
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
} from "../enums";

export const ALL_PUBLICS: {
  administrative: Array<{ name: string; value: PublicsAdministrative }>;
  familialle: Array<{ name: string; value: PublicsFamily }>;
  gender: Array<{ name: string; value: PublicsGender }>;
  other: Array<{ name: string; value: PublicsOther }>;
} = {
  administrative: [
    { name: "PUBLICS_ALL", value: PublicsAdministrative.all },
    {
      name: "PUBLICS_ADMINISTRATIVE_ASYLUM",
      value: PublicsAdministrative.asylum,
    },
    {
      name: "PUBLICS_ADMINISTRATIVE_REFUGEE",
      value: PublicsAdministrative.refugee,
    },
    {
      name: "PUBLICS_ADMINISTRATIVE_REGULAR",
      value: PublicsAdministrative.regular,
    },
    {
      name: "PUBLICS_ADMINISTRATIVE_UNDOCUMENTED",
      value: PublicsAdministrative.undocumented,
    },
  ],
  familialle: [
    { name: "PUBLICS_ALL", value: PublicsFamily.all },
    { name: "PUBLICS_FAMILY_COUPLES", value: PublicsFamily.couple },
    { name: "PUBLICS_FAMILY_FAMILY", value: PublicsFamily.family },
    { name: "PUBLICS_FAMILY_ISOLATED", value: PublicsFamily.isolated },
    { name: "PUBLICS_FAMILY_PREGNANT", value: PublicsFamily.pregnant },
  ],
  gender: [
    { name: "PUBLICS_GENDER_ALL", value: PublicsGender.all },
    { name: "PUBLICS_GENDER_MEN", value: PublicsGender.men },
    { name: "PUBLICS_GENDER_WOMEN", value: PublicsGender.women },
  ],
  other: [
    { name: "PUBLICS_ALL", value: PublicsOther.all },
    { name: "PUBLICS_OTHER_ADDICTION", value: PublicsOther.addiction },
    { name: "PUBLICS_OTHER_DISABLED", value: PublicsOther.handicap },
    { name: "PUBLICS_OTHER_HIV", value: PublicsOther.hiv },
    { name: "PUBLICS_OTHER_LGBT+", value: PublicsOther.lgbt },
    { name: "PUBLICS_OTHER_MENTAL_HEALTH", value: PublicsOther.mentalHealth },
    { name: "PUBLICS_OTHER_PRISON", value: PublicsOther.prison },
    { name: "PUBLICS_OTHER_SEX_WORKER", value: PublicsOther.prostitution },
    { name: "PUBLICS_OTHER_STUDENT", value: PublicsOther.student },
    { name: "PUBLICS_OTHER_VIOLENCE", value: PublicsOther.violence },
  ],
};
