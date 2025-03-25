import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  Publics,
  PublicsAdministrative,
  publicsValuesAreCoherent,
  WelcomedPublics,
} from "..";

describe("publicsValuesAreCoherent", () => {
  it("should return false when accueil is PREFERENTIAL with default values", () => {
    const publics: Publics = {
      accueil: WelcomedPublics.PREFERENTIAL,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: { min: 0, max: 99 },
      description: null,
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    };

    expect(publicsValuesAreCoherent(publics)).toBe(false);
  });

  it("should return true when accueil is PREFERENTIAL with default values and description", () => {
    const publics: Publics = {
      accueil: WelcomedPublics.PREFERENTIAL,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: { min: 0, max: 99 },
      description: "Open for people who live in Paris",
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    };

    expect(publicsValuesAreCoherent(publics)).toBe(true);
  });

  it("should return true when accueil is EXCLUSIVE with different values", () => {
    const publics: Publics = {
      accueil: WelcomedPublics.EXCLUSIVE,
      administrative: [
        PublicsAdministrative.asylum,
        PublicsAdministrative.refugee,
      ],
      age: { min: 0, max: 99 },
      description: null,
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    };

    expect(publicsValuesAreCoherent(publics)).toBe(true);
  });

  it("should return true when accueil is UNCONDITIONAL", () => {
    const publics: Publics = {
      accueil: WelcomedPublics.UNCONDITIONAL,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: { min: 0, max: 18 },
      description: null,
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    };

    expect(publicsValuesAreCoherent(publics)).toBe(true);
  });
});
