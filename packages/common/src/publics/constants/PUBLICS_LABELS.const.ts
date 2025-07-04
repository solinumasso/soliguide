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
  PublicsAdministrative,
  PublicsFamily,
  PublicsGender,
  PublicsOther,
} from "../enums";

export const PUBLICS_LABELS: {
  administrative: { [key in PublicsAdministrative]: string };
  familialle: { [key in PublicsFamily]: string };
  gender: { [key in PublicsGender]: string };
  other: { [key in PublicsOther]: string };
} = {
  gender: {
    [PublicsGender.all]: "PUBLICS_GENDER_ALL",
    [PublicsGender.men]: "PUBLICS_GENDER_MEN",
    [PublicsGender.women]: "PUBLICS_GENDER_WOMEN",
  },
  administrative: {
    [PublicsAdministrative.all]: "PUBLICS_ALL",
    [PublicsAdministrative.asylum]: "PUBLICS_ADMINISTRATIVE_ASYLUM",
    [PublicsAdministrative.refugee]: "PUBLICS_ADMINISTRATIVE_REFUGEE",
    [PublicsAdministrative.regular]: "PUBLICS_ADMINISTRATIVE_REGULAR",
    [PublicsAdministrative.undocumented]: "PUBLICS_ADMINISTRATIVE_UNDOCUMENTED",
  },
  familialle: {
    [PublicsFamily.all]: "PUBLICS_ALL",
    [PublicsFamily.couple]: "PUBLICS_FAMILY_COUPLES",
    [PublicsFamily.family]: "PUBLICS_FAMILY_FAMILY",
    [PublicsFamily.isolated]: "PUBLICS_FAMILY_ISOLATED",
    [PublicsFamily.pregnant]: "PUBLICS_FAMILY_PREGNANT",
  },
  other: {
    [PublicsOther.all]: "PUBLICS_OTHER_ALL",
    [PublicsOther.addiction]: "PUBLICS_OTHER_ADDICTION",
    [PublicsOther.handicap]: "PUBLICS_OTHER_DISABLED",
    [PublicsOther.hiv]: "PUBLICS_OTHER_HIV",
    [PublicsOther.lgbt]: "PUBLICS_OTHER_LGBT+",
    [PublicsOther.mentalHealth]: "PUBLICS_OTHER_VIOLENCE",
    [PublicsOther.prison]: "PUBLICS_OTHER_PRISON",
    [PublicsOther.prostitution]: "PUBLICS_OTHER_SEX_WORKER",
    [PublicsOther.student]: "PUBLICS_OTHER_STUDENT",
    [PublicsOther.violence]: "PUBLICS_OTHER_VIOLENCE",
  },
};
