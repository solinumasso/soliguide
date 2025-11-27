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
  Categories,
  SupportedLanguagesCode,
  UserStatus,
  UserRole,
  Phone,
  UserForAuth,
  AnyDepartmentCode,
  OperationalAreas,
  getTerritoriesFromAreas,
  ApiOrganization,
} from "@soliguide/common";

import { Organisation } from "../../admin-organisation/interfaces/organisation.interface";
import { THEME_CONFIGURATION } from "../../../models";

export class User {
  // Basics infos
  public user_id: number | null;
  public createdAt: Date | null;
  public _id: string | null;

  public mail: string;
  public name: string;
  public lastname: string;

  public phone: Phone | null;
  public title: string;
  public languages: SupportedLanguagesCode[];

  // Password
  public password: string | null;

  // NEW MODEL ORGA
  public organizations: Organisation[];

  // Orga et rôles actuels
  public currentOrga: Organisation | null;

  // Index de l'orga choisie
  public selectedOrgaIndex: number;

  // Role correspondant à l'orga selectionnée
  public role: UserRole | null;
  // Si éditeur ou reader : places associés
  public places: number[];

  // ROLES
  // ADMIN SOLIGUIDE
  public admin: boolean;
  public translator: boolean;

  public territories: AnyDepartmentCode[];

  public status: UserStatus;

  public categoriesLimitations: Categories[];

  public pro: boolean;
  public devToken: string;
  public token: string | null;

  public verified: boolean;
  public areas?: OperationalAreas;

  constructor(user?: Partial<UserForAuth>, light = false) {
    this._id = user?._id ?? null;
    this.user_id = user?.user_id ?? null;
    this.mail = user?.mail ?? "";

    this.lastname = user?.lastname ?? "";
    this.password = null;

    this.name = user?.name ?? "";
    this.title = user?.title ?? "";
    this.verified = user?.verified ?? false;
    this.phone = user?.phone ?? null;
    this.organizations = [];

    this.territories = user
      ? getTerritoriesFromAreas(
          user as UserForAuth,
          THEME_CONFIGURATION.country
        )
      : [];

    this.status = user?.status ?? UserStatus.SIMPLE_USER;
    this.translator = user?.translator ?? false;

    this.admin =
      this.status === UserStatus.ADMIN_SOLIGUIDE ||
      this.status === UserStatus.ADMIN_TERRITORY;

    this.pro = this.status === UserStatus.PRO;
    this.languages = user?.languages ?? [];

    this.devToken = user?.devToken ?? "";

    this.selectedOrgaIndex = user?.selectedOrgaIndex ?? 0;
    this.categoriesLimitations = user?.categoriesLimitations ?? [];

    this.role = user?.role ?? null;
    this.places = user?.places ?? [];
    this.currentOrga = null;
    this.token = null;
    this.areas =
      this.status === UserStatus.ADMIN_SOLIGUIDE ||
      this.status === UserStatus.ADMIN_TERRITORY
        ? user?.areas
        : undefined;

    if (!light && user && this.pro && user.organizations?.length > 0) {
      this.organizations = user.organizations.map(
        (
          organisation: Pick<
            ApiOrganization,
            "_id" | "organization_id" | "name"
          >
        ) => new Organisation(organisation)
      );
      this.currentOrga = this.organizations[this.selectedOrgaIndex];
    }
  }
}
