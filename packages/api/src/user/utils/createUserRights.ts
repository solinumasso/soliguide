import { UserRole, UserRightStatus, ApiPlace } from "@soliguide/common";
import mongoose from "mongoose";
import { OrganizationPopulate, UserRight, ModelWithId } from "../../_models";

export const createUserRights = (
  user: { user_id: number; _id: mongoose.Types.ObjectId },
  organization: Pick<OrganizationPopulate, "_id" | "organization_id">,
  places: Pick<ModelWithId<ApiPlace>, "_id" | "lieu_id">[],
  role: UserRole = UserRole.READER,
  isInvitation = false,
  displayContactPro = false
): UserRight[] => {
  const userRights: UserRight[] = [];

  if (places.length > 0) {
    for (const place of places) {
      userRights.push({
        displayContactPro,
        organization: organization._id,
        organization_id: organization.organization_id,
        place: place._id,
        place_id: place.lieu_id,
        role,
        status: isInvitation
          ? UserRightStatus.PENDING
          : UserRightStatus.VERIFIED,
        user: user._id,
        user_id: user.user_id,
      });
    }
  }

  // The right by default
  // Every user need a right with place and place_id as null
  // If any organization has 0 places, we have to keep a link between users and organizations
  userRights.push({
    displayContactPro,
    organization: organization._id,
    organization_id: organization.organization_id,
    place: null,
    place_id: null,
    role,
    status: isInvitation ? UserRightStatus.PENDING : UserRightStatus.VERIFIED,
    user: user._id,
    user_id: user.user_id,
  });

  return userRights;
};
