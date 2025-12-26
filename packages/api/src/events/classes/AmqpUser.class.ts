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
import mongoose from "mongoose";

import type {
  AnyDepartmentCode,
  ApiOrganization,
  Categories,
  OperationalAreas,
  Phone,
  SupportedLanguagesCode,
  UserStatus,
} from "@soliguide/common";

import type {
  ModelWithId,
  User,
  UserPopulateType,
  UserRight,
} from "../../_models";
import { AmqpOrganization, AmqpUserRight } from ".";

export class AmqpUser {
  public status: UserStatus;
  public firstname: string;
  public lastname: string;
  public email: string;
  public user_id: number;
  public phone?: Phone;
  public organizations?: (string | AmqpOrganization)[];
  public territories: AnyDepartmentCode[];
  public rights?: AmqpUserRight[];
  public apiAuthorizedCategories?: Categories[];
  public title?: string;
  public isTranslator: boolean;
  public languages?: SupportedLanguagesCode[];
  public verified: boolean;
  public resetPasswordToken?: string;
  public areas: OperationalAreas;

  constructor(user: UserPopulateType | ModelWithId<User>) {
    this.status = user.status;
    this.firstname = user.name;
    this.lastname = user.lastname;
    this.email = user.mail;
    this.user_id = user.user_id;
    this.phone = user.phone ?? undefined;
    this.organizations = user.organizations?.map(
      (organization: ApiOrganization | mongoose.Types.ObjectId) => {
        if (organization instanceof mongoose.Types.ObjectId) {
          return organization.toString();
        }
        return new AmqpOrganization(organization);
      }
    );
    this.organizations = this.organizations ?? undefined;
    this.territories = user.territories;
    this.apiAuthorizedCategories = user.categoriesLimitations?.length
      ? user.categoriesLimitations
      : undefined;
    if ("userRights" in user && user.userRights?.length) {
      this.rights = user.userRights.map(
        (userRight: UserRight) => new AmqpUserRight(userRight)
      );
    }
    this.title = user.title?.length ? user.title : undefined;
    this.isTranslator = user.translator;
    this.languages = user.languages?.length ? user.languages : undefined;
    this.verified = user.verified;
    this.resetPasswordToken = user.passwordToken ?? undefined;

    if (user.areas) {
      this.areas = user.areas;
    }
  }
}
