import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  Publics,
  WelcomedPublics,
} from "..";

/**
 * The 'welcomed publics' which are not unconditional must have at least one variatation
 * in default values.
 * If we indicate 'preferential' or 'exclusive', it is necessary to indicate at least a discriminating element
 * In welcomed audiences
 *
 * @param {Publics} publics
 * @returns {boolean}
 */
export const publicsValuesAreCoherent = (publics: Publics): boolean => {
  if (publics.accueil === WelcomedPublics.UNCONDITIONAL) {
    return true;
  }

  const hasCustomGender =
    !publics.gender.every((item) => GENDER_DEFAULT_VALUES.includes(item)) ||
    !GENDER_DEFAULT_VALUES.every((item) => publics.gender.includes(item));

  const hasCustomAdministrative =
    !publics.administrative.every((item) =>
      ADMINISTRATIVE_DEFAULT_VALUES.includes(item)
    ) ||
    !ADMINISTRATIVE_DEFAULT_VALUES.every((item) =>
      publics.administrative.includes(item)
    );

  const hasCustomFamilial =
    !publics.familialle.every((item) => FAMILY_DEFAULT_VALUES.includes(item)) ||
    !FAMILY_DEFAULT_VALUES.every((item) => publics.familialle.includes(item));

  const hasCustomOther =
    !publics.other.every((item) => OTHER_DEFAULT_VALUES.includes(item)) ||
    !OTHER_DEFAULT_VALUES.every((item) => publics.other.includes(item));

  const hasCustomAge = publics.age.min !== 0 || publics.age.max !== 99;

  const hasDescription = !!(
    publics?.description &&
    typeof publics.description === "string" &&
    publics.description.trim().length > 0
  );

  return (
    hasCustomGender ||
    hasCustomAdministrative ||
    hasCustomFamilial ||
    hasCustomOther ||
    hasCustomAge ||
    hasDescription
  );
};
