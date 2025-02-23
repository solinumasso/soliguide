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
import {
  SupportedLanguagesCode,
  CommonUser,
  AnyDepartmentCode,
  UserStatus,
  UserStatusNotLogged,
  UserTypeLogged,
  SoliguideCountries,
} from "@soliguide/common";

import type { AirtableSyncType } from "../../airtable";
import { InvitationPopulate } from "./Invitation.interface";
import type {
  UserCampaignEmails,
  UserRight,
  UserRightOrganizationPopulate,
} from "../types";
import { ModelWithId } from "../../mongo";
import { OrganizationPopulate } from "../../organization";
import { Origin } from "../enums";

export interface User extends Omit<CommonUser, "_id"> {
  _id?: mongoose.Types.ObjectId;
  atSync: AirtableSyncType;
  campaigns: {
    MAJ_ETE_2022: UserCampaignEmails;
    MAJ_ETE_2023: UserCampaignEmails;
    MAJ_HIVER_2022: UserCampaignEmails;
    MAJ_HIVER_2023: UserCampaignEmails;
    END_YEAR_2024: UserCampaignEmails;
    MAJ_ETE_2024: UserCampaignEmails;
    UKRAINE_2022: UserCampaignEmails;
  };
  invitations: mongoose.Types.ObjectId[];
  organizations: mongoose.Types.ObjectId[];
  passwordToken: string | null;
  territories: AnyDepartmentCode[];
}

export type UserPopulateType = ModelWithId<User> &
  Required<{
    organizations: OrganizationPopulate[];
    invitations: InvitationPopulate[];
    userRights: Array<UserRight | UserRightOrganizationPopulate>;
    places?: number[];
    type: UserTypeLogged.LOGGED;
  }>;

// Matches what the DTO authorize and return (except for passwordConfirmation)
export type SignupUser = Pick<
  User,
  "name" | "lastname" | "mail" | "status" | "areas"
> &
  Partial<
    Pick<
      User,
      "title" | "territories" | "phone" | "categoriesLimitations" | "password"
    >
  > & {
    country: SoliguideCountries;
  };

export type NotLoggedUserType = {
  type: UserTypeLogged.NOT_LOGGED;
  language?: SupportedLanguagesCode;
  status: UserStatusNotLogged.NOT_LOGGED | UserStatus.WIDGET_USER;
};

export type PartialUserForLogs = {
  language?: SupportedLanguagesCode;
  orgaId: null;
  orgaName: null;
  origin: Origin;
  status: UserStatusNotLogged;
  referrer: string | null;
  role: null;
  territory: null;
  user_id: null;
};

export type CurrentUserType = (UserPopulateType | NotLoggedUserType) & {
  isLogged: () => boolean;
};

abstract class ACurrentUser {
  abstract isLogged(): boolean;
}

export class UserFactory {
  public static createUser(
    user: UserPopulateType | NotLoggedUserType
  ): UserPopulateType | NotLoggedUserType {
    if (user.type === UserTypeLogged.LOGGED) {
      return new UserPopulate(user as UserPopulateType);
    } else {
      return new NotLoggedUser(user as NotLoggedUserType);
    }
  }
}

class UserPopulate implements ACurrentUser, UserPopulate {
  public _id;
  public organizations;
  public invitations;
  public userRights;
  public places;
  public type;
  public verified;
  public name;
  public lastname;
  public phone;
  public mail;
  public password;
  public createdAt;
  public updatedAt;
  public title;
  public blocked;
  public status;
  public languages;
  public selectedOrgaIndex;
  public user_id;
  public categoriesLimitations;
  public translator;
  public verifiedAt;
  public atSync;
  public campaigns;
  public devToken;
  public passwordToken;
  public territories;
  public areas;

  constructor(user: UserPopulateType) {
    this._id = user?._id;
    this.organizations = user?.organizations;
    this.invitations = user?.invitations;
    this.userRights = user?.userRights;
    this.places = user?.places;
    this.type = user?.type;
    this.verified = user?.verified;
    this.name = user?.name;
    this.lastname = user?.lastname;
    this.phone = user?.phone;
    this.mail = user?.mail;
    this.password = user?.password;
    this.createdAt = user?.createdAt;
    this.updatedAt = user?.updatedAt;
    this.title = user?.title;
    this.blocked = user?.blocked;
    this.status = user?.status;
    this.languages = user?.languages;
    this.selectedOrgaIndex = user?.selectedOrgaIndex;
    this.user_id = user?.user_id;
    this.categoriesLimitations = user?.categoriesLimitations;
    this.translator = user?.translator;
    this.verifiedAt = user?.verifiedAt;
    this.atSync = user?.atSync;
    this.campaigns = user?.campaigns;
    this.devToken = user?.devToken;
    this.passwordToken = user?.passwordToken;
    this.territories = user?.territories;
    this.areas = user?.areas;
  }

  isLogged(): boolean {
    return this.type === UserTypeLogged.LOGGED;
  }
}

class NotLoggedUser implements ACurrentUser, NotLoggedUserType {
  public type;
  public language;
  public status;

  constructor(user: NotLoggedUserType) {
    this.type = user?.type;
    this.language = user?.language;
    this.status = user?.status;
  }
  isLogged(): boolean {
    return this.type !== UserTypeLogged.NOT_LOGGED;
  }
}
