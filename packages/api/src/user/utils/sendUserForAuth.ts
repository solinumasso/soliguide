import { aggregateUserRightsForAuth } from "./aggregateUserRightsForAuth";

import { UserPopulateType } from "../../_models";

import { ApiOrganization, UserForAuth } from "@soliguide/common";

export const sendUserForAuth = (user: UserPopulateType): UserForAuth => {
  const { places, role } = aggregateUserRightsForAuth(user);
  const organizations: Array<
    Pick<ApiOrganization, "_id" | "organization_id" | "name">
  > = [];

  user.organizations.forEach((organization: ApiOrganization) => {
    organizations.push({
      _id: organization._id,
      name: organization.name,
      organization_id: organization.organization_id,
    });
  });

  return {
    _id: user._id.toString(),
    categoriesLimitations: user.categoriesLimitations,
    devToken: user.devToken,
    languages: user.languages,
    lastname: user.lastname,
    mail: user.mail,
    name: user.name,
    organizations,
    phone: user.phone,
    places,
    role,
    selectedOrgaIndex: user.selectedOrgaIndex,
    status: user.status,
    title: user.title,
    translator: user.translator,
    user_id: user.user_id,
    verified: user.verified,
    areas: user?.areas,
    lastLogin: user?.lastLogin,
  };
};
