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
  other: { [key in PublicsOther]?: string };
} = {
  gender: {
    all: "PUBLICS_GENDER_ALL",
    men: "PUBLICS_GENDER_MEN",
    women: "PUBLICS_GENDER_WOMEN",
  },
  administrative: {
    all: "PUBLICS_ALL",
    asylum: "PUBLICS_ADMINISTRATIVE_ASYLUM",
    refugee: "PUBLICS_ADMINISTRATIVE_REFUGEE",
    regular: "PUBLICS_ADMINISTRATIVE_REGULAR",
    undocumented: "PUBLICS_ADMINISTRATIVE_UNDOCUMENTED",
  },
  familialle: {
    all: "PUBLICS_ALL",
    couple: "PUBLICS_FAMILY_COUPLES",
    family: "PUBLICS_FAMILY_FAMILY",
    isolated: "PUBLICS_FAMILY_ISOLATED",
    pregnant: "PUBLICS_FAMILY_PREGNANT",
  },
  other: {
    addiction: "PUBLICS_OTHER_ADDICTION",
    all: "PUBLICS_OTHER_ALL",
    handicap: "PUBLICS_OTHER_DISABLED",
    hiv: "PUBLICS_OTHER_HIV",
    lgbt: "PUBLICS_OTHER_LGBT+",
    prison: "PUBLICS_OTHER_PRISON",
    prostitution: "PUBLICS_OTHER_SEX_WORKER",
    student: "PUBLICS_OTHER_STUDENT",
    violence: "PUBLICS_OTHER_VIOLENCE",
  },
};
