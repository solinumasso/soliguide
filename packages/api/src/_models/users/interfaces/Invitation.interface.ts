import type { ApiOrganization, CommonInvitation } from "@soliguide/common";
import mongoose from "mongoose";
import type { User } from "./User.interface";
import type { ModelWithId } from "../../mongo";

export interface Invitation extends Omit<CommonInvitation, "createdBy"> {
  _id: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
}

export type InvitationPopulate = Omit<Invitation, "organization" | "user"> &
  Required<{
    organization: ModelWithId<Omit<ApiOrganization, "_id">>;
    user: ModelWithId<User>;
  }>;
