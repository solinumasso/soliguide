import * as UserRightsService from "../services/userRights.service";

import { searchPlacesIds } from "../../search/services";

import {
  ModelWithId,
  OrganizationPopulate,
  User,
  UserPopulateType,
} from "../../_models";
import {
  ApiPlace,
  UserRightEditionPayload,
  UserStatus,
} from "@soliguide/common";
import { hasAdminAccessToPlace } from "../../_utils";
import { createUserRights } from "../utils";

export const getUserRightsForOrganization = async (
  organization: OrganizationPopulate
) => {
  return await UserRightsService.getUserRightsForOrganization(organization);
};

export const patchUserRights = async (
  user: UserPopulateType,
  organization: OrganizationPopulate,
  updateRightsData: UserRightEditionPayload
): Promise<OrganizationPopulate> => {
  await UserRightsService.deleteUserRightsWithParams({
    organization: organization._id,
    user: user._id,
  });

  const places = await searchPlacesIds(updateRightsData.places);

  const rightsToSave = createUserRights(
    user,
    organization,
    places,
    updateRightsData.role,
    updateRightsData.isInvitation
  );

  await UserRightsService.saveUserRights(rightsToSave);

  return organization;
};

export const canAddPlace = async (user: UserPopulateType): Promise<boolean> => {
  if (
    user.status === UserStatus.ADMIN_SOLIGUIDE ||
    user.status === UserStatus.ADMIN_TERRITORY ||
    user.status === UserStatus.SOLI_BOT
  ) {
    return true;
  }

  if (user.status === UserStatus.PRO) {
    return await UserRightsService.canAddPlace(user._id);
  }
  return false;
};

// Place or Soliguide admin
export const canDeletePlace = async (
  user: Pick<ModelWithId<User>, "_id" | "status" | "territories">,
  place: ApiPlace
): Promise<boolean> => hasAdminAccessToPlace(user, place);

export const canEditPlace = async (
  user: Pick<UserPopulateType, "_id" | "status" | "territories">,
  place: ApiPlace
): Promise<boolean> => {
  if (hasAdminAccessToPlace(user, place)) {
    return true;
  }

  return await UserRightsService.canEditPlace(user._id, place.lieu_id);
};
