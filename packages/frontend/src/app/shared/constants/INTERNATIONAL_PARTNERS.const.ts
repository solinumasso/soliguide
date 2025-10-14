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
import { CountryCodes } from "@soliguide/common";
import { Logos } from "../types";

export interface LogoWithLink extends Logos {
  link: string;
  size: "small" | "large";
}

const LOGOS_BASE_PATH = "../../../../../assets/images/poctefa-logos";

export const ALL_LOGOS: LogoWithLink[] = [
  {
    path: `${LOGOS_BASE_PATH}/Isologo.svg`,
    alt: "iSocial",
    link: "https://isocial.cat/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/solinum.svg`,
    alt: "Solinum",
    link: "https://www.solinum.org/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/andorra-recerca-innovacio-ca.svg`,
    alt: "Andorra Research & Innovation",
    link: "https://www.ari.ad/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/alba_verd.svg`,
    alt: "Alba",
    link: "https://aalba.cat/ca/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/pere-claver.png`,
    alt: "Pere Claver",
    link: "https://www.pereclaver.org/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/Fundació Resilis.svg`,
    alt: "Fundació Resilis",
    link: "https://www.resilis.org/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/poctefa.svg`,
    alt: "Interreg POCTEFA",
    link: "https://www.poctefa.eu/",
    size: "large",
  },
  {
    path: `${LOGOS_BASE_PATH}/diputació-de-tarragona.svg`,
    alt: "Diputació de Tarragona",
    link: "https://www.dipta.cat/",
    size: "small",
  },
  {
    path: `${LOGOS_BASE_PATH}/generalitat-catalunya.jpg`,
    alt: "Departament de Drets Socials i Inclúsió",
    link: "https://dretssocials.gencat.cat/ca/inici/",
    size: "small",
  },
];

export const LOGOS_BY_COUNTRY: Partial<Record<CountryCodes, string[]>> = {
  [CountryCodes.ES]: [
    "Alba",
    "Andorra Research & Innovation",
    "Departament de Drets Socials i Inclúsió",
    "Diputació de Tarragona",
    "Fundació Resilis",
    "Interreg POCTEFA",
    "iSocial",
    "Pere Claver",
    "Solinum",
  ],
  [CountryCodes.AD]: [
    "Alba",
    "Andorra Research & Innovation",
    "Andorra Research & Innovation",
    "Departament de Drets Socials i Inclúsió",
    "Diputació de Tarragona",
    "Fundació Resilis",
    "Interreg POCTEFA",
    "iSocial",
    "Pere Claver",
    "Solinum",
  ],
  [CountryCodes.FR]: [], // No partner logos for France currently
};

export const FUNDERS_BY_COUNTRY: Partial<Record<CountryCodes, string[]>> = {
  [CountryCodes.ES]: [
    "Interreg POCTEFA",
    "Diputació de Tarragona",
    "Departament de Drets Socials i Inclúsió",
  ],
  [CountryCodes.AD]: [
    "Interreg POCTEFA",
    "Diputació de Tarragona",
    "Departament de Drets Socials i Inclúsió",
  ],
  [CountryCodes.FR]: [],
};
