/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
