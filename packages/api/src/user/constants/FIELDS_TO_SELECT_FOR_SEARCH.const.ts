import { UserSearchContext } from "@soliguide/common";

export const FIELDS_TO_SELECT_FOR_SEARCH: Record<UserSearchContext, string> = {
  MANAGE_PARTNERS:
    "_id blocked areas categoriesLimitations createdAt developer devToken lastname lastLogin mail name territories user_id verified",
  MANAGE_USERS:
    "_id createdAt areas invitations lastname lastLogin mail name organizations passwordToken status territories translator user_id verified",
};
