import {
  getContactsFromUserRights,
  updateUserRightsWithParams,
} from "../../user/services";
import {
  aggregateUsersForContacts,
  aggregateUsersForContactsEdition,
} from "../utils";
import {
  ApiPlace,
  PlaceContact,
  PlaceContactForAdmin,
} from "@soliguide/common";
import { UserPopulateType, UserRight, ModelWithId } from "../../_models";

export const getContactsProForPlace = async (
  place: ModelWithId<ApiPlace>
): Promise<PlaceContact[]> => {
  const rights = await getContactsFromUserRights(place._id, true);

  return aggregateUsersForContacts(rights);
};

export const getContactsProForPlaceAdmin = async (
  place: ModelWithId<ApiPlace>,
  user: UserPopulateType
): Promise<PlaceContactForAdmin[]> => {
  const rights = await getContactsFromUserRights(place._id);
  return aggregateUsersForContactsEdition(rights, user);
};

export const patchDisplayContactPro = async (
  userRight: Pick<UserRight, "_id">,
  newValue: Pick<UserRight, "displayContactPro">
): Promise<void> => {
  await updateUserRightsWithParams(
    {
      _id: userRight._id,
    },
    newValue
  );
};
