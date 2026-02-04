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
import type {
  SoliguideCountries,
  SupportedLanguagesCode,
  Themes,
} from "@soliguide/common";

import type { AmqpEvent } from "../interfaces";

export class AmqpContactFormEvent implements AmqpEvent {
  public name: string;
  public email: string;
  public subject: string;
  public message: string;
  public country: SoliguideCountries;
  public territory: string | null;
  public locale: SupportedLanguagesCode;
  public frontendUrl: string;
  public theme: Themes | null;

  constructor(params: {
    name: string;
    email: string;
    subject: string;
    message: string;
    country: SoliguideCountries;
    territory: string | null;
    locale: SupportedLanguagesCode;
    frontendUrl: string;
    theme: Themes | null;
  }) {
    this.name = params.name;
    this.email = params.email;
    this.subject = params.subject;
    this.message = params.message;
    this.country = params.country;
    this.territory = params.territory;
    this.locale = params.locale;
    this.frontendUrl = params.frontendUrl;
    this.theme = params.theme;
  }
}
