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
  AllUserStatus,
  CommonUser,
  SoliguideCountries,
  SupportedLanguagesCode,
  UserStatus,
  UserStatusNotLogged,
  UserTypeLogged,
} from "@soliguide/common";
import mongoose from "mongoose";

import { InvitationPopulate } from "./Invitation.interface";
import { ModelWithId, OrganizationPopulate, Origin } from "../../_models";
import { UserCampaignEmails } from "../types";
import {
  UserRight,
  UserRightOrganizationPopulate,
} from "./UserRight.interface";

export interface User extends Omit<CommonUser, "_id"> {
  _id?: mongoose.Types.ObjectId;
  campaigns: {
    MAJ_ETE_2022: UserCampaignEmails;
    MAJ_ETE_2023: UserCampaignEmails;
    MAJ_HIVER_2022: UserCampaignEmails;
    MAJ_HIVER_2023: UserCampaignEmails;
    END_YEAR_2024: UserCampaignEmails;
    MAJ_ETE_2024: UserCampaignEmails;
    MID_YEAR_2025: UserCampaignEmails;
    END_YEAR_2025: UserCampaignEmails;
    UKRAINE_2022: UserCampaignEmails;
  };
  invitations: mongoose.Types.ObjectId[];
  organizations: mongoose.Types.ObjectId[];
  passwordToken: string | null;
}

export interface UserPopulateType
  extends Omit<ModelWithId<User>, "invitations" | "organizations" | "status"> {
  organizations: OrganizationPopulate[];
  invitations: InvitationPopulate[];
  userRights: Array<UserRight | UserRightOrganizationPopulate>;
  places?: number[];
  status: UserStatus;
  type: UserTypeLogged;
}
// Matches what the DTO authorize and return (except for passwordConfirmation)
export type SignupUser = Pick<
  User,
  "name" | "lastname" | "mail" | "status" | "areas"
> &
  Partial<
    Pick<User, "title" | "phone" | "categoriesLimitations" | "password">
  > & {
    country: SoliguideCountries;
  };

export interface NotLoggedUserType extends Omit<UserPopulateType, "status"> {
  type: UserTypeLogged;
  language: SupportedLanguagesCode; // Current Language
  isLogged(): boolean;
  status: AllUserStatus;
}

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

export class UserPopulate implements UserPopulateType {
  public _id;
  public organizations;
  public invitations;
  public userRights;
  public places;
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
  public type: UserTypeLogged;
  public status: UserStatus;
  public languages;
  public language: SupportedLanguagesCode; // Current Language
  public selectedOrgaIndex;
  public user_id;
  public categoriesLimitations;
  public translator;
  public verifiedAt;
  public campaigns;
  public devToken;
  public passwordToken;
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
    this.campaigns = user?.campaigns;
    this.devToken = user?.devToken;
    this.passwordToken = user?.passwordToken;
    this.areas = user?.areas;
  }

  isLogged(): boolean {
    return this.type === UserTypeLogged.LOGGED;
  }
}
