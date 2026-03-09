import {
  PlaceContact,
  PlaceContactForAdmin,
  UserRole,
  UserStatus,
} from "@soliguide/common";
import { UserPopulateType, UserRightUserPopulate } from "../../_models";

const userStatuses = Object.values(UserStatus);

// Roles filtered by user, used in the professional directory pages
export const aggregateUsersForContactsEdition = (
  rightsFromDb: UserRightUserPopulate[],
  authUser: UserPopulateType
): PlaceContactForAdmin[] => {
  if (!rightsFromDb) {
    return [];
  }
  const placeRights: PlaceContactForAdmin[] = [];
  const userIds: number[] = [];

  const isAdmin =
    authUser.status === UserStatus.ADMIN_SOLIGUIDE ||
    authUser.status === UserStatus.ADMIN_TERRITORY;

  const authUserRoleForOrga: { [key: string]: UserRole } = {};

  if (!isAdmin && authUser.userRights) {
    for (const userRights of authUser.userRights) {
      const organizationObjectId = userRights.organization;
      if (organizationObjectId) {
        authUserRoleForOrga[organizationObjectId.toString()] = userRights.role;
      }
    }
  }

  // Compare the user's organization with roles organizations
  for (const right of rightsFromDb) {
    if (!userIds.includes(right.user_id)) {
      userIds.push(right.user_id);

      const currentRight: PlaceContactForAdmin = {
        _id: right._id.toString(),
        canEdit: isAdmin,
        canEditUserInfos: isAdmin,
        displayContactPro: right.displayContactPro,
        lastname: right.user.lastname,
        mail: right.user.mail,
        name: right.user.name,
        phone: right.user?.phone ?? null,
        status: right.user.status,
        title: right.user?.title ?? null,
        userObjectId: right.user._id.toString(),
      };

      if (!isAdmin) {
        const currentRightRole: UserRole | null = Object.hasOwn(
          authUserRoleForOrga,
          right.organization.toString()
        )
          ? authUserRoleForOrga[right.organization.toString()]
          : null;

        if (
          userStatuses.indexOf(right.user.status) <=
          userStatuses.indexOf(authUser.status)
        ) {
          currentRight.canEdit = true;
          currentRight.canEditUserInfos =
            currentRightRole === UserRole.OWNER ||
            right.user_id === authUser.user_id;
        }
      }

      placeRights.push(currentRight);
    }
  }

  placeRights
    .sort((x, y) => {
      return x.canEditUserInfos === y.canEditUserInfos
        ? 0
        : x.canEditUserInfos
        ? -1
        : 1;
    })
    .sort((x, y) => {
      return x.canEdit === y.canEdit ? 0 : x.canEdit ? -1 : 1;
    });

  return placeRights;
};

export const aggregateUsersForContacts = (
  rightsFromDb: UserRightUserPopulate[]
): PlaceContact[] => {
  if (!rightsFromDb) {
    return [];
  }
  const placeRights: PlaceContact[] = [];
  const userIds: number[] = [];

  // Compare the user's organization with roles organizations
  for (const right of rightsFromDb) {
    if (right.displayContactPro && !userIds.includes(right.user_id)) {
      userIds.push(right.user_id);

      const currentRight: PlaceContact = {
        lastname: right.user.lastname,
        mail: right.user.mail,
        name: right.user.name,
        phone: right.user?.phone ?? null,
        title: right.user?.title ?? null,
      };

      placeRights.push(currentRight);
    }
  }

  return placeRights;
};
