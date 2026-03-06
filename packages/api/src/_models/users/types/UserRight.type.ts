import mongoose from "mongoose";

import { ApiOrganization, UserRightStatus, UserRole } from "@soliguide/common";
import { ModelWithId } from "../../mongo";
import { PopulatedUser } from "./PopulatedUser.type";

export interface UserRight {
  _id?: mongoose.Types.ObjectId;
  displayContactPro: boolean;
  organization: mongoose.Types.ObjectId;
  organization_id: number;
  place: mongoose.Types.ObjectId | null;
  place_id: number | null;
  role: UserRole;
  status: UserRightStatus;
  user: mongoose.Types.ObjectId;
  user_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRightUserPopulate = ModelWithId<Omit<UserRight, "user">> &
  Required<{
    user: PopulatedUser;
  }>;

export type UserRightOrganizationPopulate = ModelWithId<
  Omit<UserRight, "organization">
> &
  Required<{
    organization: ModelWithId<ApiOrganization>;
  }>;
