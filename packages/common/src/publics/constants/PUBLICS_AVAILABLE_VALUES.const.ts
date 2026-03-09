import {
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
} from "../enums";

export const ADMINISTRATIVE_DEFAULT_VALUES: PublicsAdministrative[] =
  Object.values(PublicsAdministrative).filter(
    (value: PublicsAdministrative) => value !== PublicsAdministrative.all
  );

export const FAMILY_DEFAULT_VALUES: PublicsFamily[] = Object.values(
  PublicsFamily
).filter((value: PublicsFamily) => value !== PublicsFamily.all);

export const GENDER_DEFAULT_VALUES: PublicsGender[] = Object.values(
  PublicsGender
).filter((value: PublicsGender) => value !== PublicsGender.all);

export const OTHER_DEFAULT_VALUES: PublicsOther[] = Object.values(
  PublicsOther
).filter((value: PublicsOther) => value !== PublicsOther.all);
