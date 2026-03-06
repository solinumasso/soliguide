import { ApiOrganization, UserRightStatus, UserRole } from "@soliguide/common";
import { UserPopulateType, UserRight } from "../../_models";

export const aggregateUserRightsForAuth = (
  user: UserPopulateType,
  organizationId?: string
): {
  role: UserRole;
  places: number[];
} => {
  if (!user.userRights) {
    return {
      role: UserRole.READER,
      places: [],
    };
  }
  let role: UserRole = UserRole.READER;
  const places: number[] = [];
  const selectedOrganization: ApiOrganization =
    user.organizations?.[user.selectedOrgaIndex];

  const orgId = organizationId || selectedOrganization?.organization_id;

  const tmpUserRights = user.userRights.filter(
    (userRight: UserRight) =>
      userRight.status === UserRightStatus.VERIFIED &&
      userRight.organization_id === orgId
  );

  if (tmpUserRights?.length) {
    role = tmpUserRights[0].role;

    tmpUserRights.forEach((userRight: UserRight) => {
      if (userRight.place_id !== null) {
        places.push(userRight.place_id as number);
      }
    });
  }

  return {
    places,
    role,
  };
};
