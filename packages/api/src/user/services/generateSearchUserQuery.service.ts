
import { UserStatus } from "@soliguide/common";
import { User } from "../../_models/users";
import { getGlobalSearchQuery } from "../../search/services";
import { parseTerritories } from "../../search/utils";

export const generateSearchUserQuery = (
  searchUserData: {
    [k in
      | "name"
      | "mail"
      | "status"
      | "verified"
      | "territories"
      | "developer"]: any;
  },
  user: User
) => {
  const query = getGlobalSearchQuery(
    searchUserData,
    ["name", "mail", "status", "verified"],
    user
  );

  parseTerritories(query, searchUserData, "territories", user, true, true);

  if (searchUserData.developer) {
    query.status = UserStatus.API_USER;
  }

  if (
    user.status !== UserStatus.ADMIN_SOLIGUIDE &&
    user.status !== UserStatus.SOLI_BOT
  ) {
    query.$and = [
      {
        status: {
          $nin: [UserStatus.SOLI_BOT, UserStatus.ADMIN_SOLIGUIDE],
        },
      },
    ];
  }
  return query;
};
