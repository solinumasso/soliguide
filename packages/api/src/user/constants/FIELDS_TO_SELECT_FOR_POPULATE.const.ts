
import { PopulatedUser } from "../../_models";

export const ARRAY_OF_USERS_FIELDS_TO_POPULATE: Array<keyof PopulatedUser> = [
  "_id",
  "areas",
  "invitations",
  "lastname",
  "lastLogin",
  "mail",
  "name",
  "organizations",
  "phone",
  "status",
  "territories",
  "title",
  "user_id",
  "verified",
];

export const USERS_FIELDS_FOR_POPULATE: string =
  ARRAY_OF_USERS_FIELDS_TO_POPULATE.join(" ");

export const PLACE_FIELDS_FOR_USERS =
  "_id campaigns close createdAt entity lieu_id name parcours placeType position priority visibility seo_url services_all status verified updatedAt updatedByUserAt";

// Defaults joins for users : organizations, invitations
export const DEFAULT_USER_POPULATE = [
  "invitations",
  {
    path: "invitations",
    populate: { path: "organization" },
  },
  "organizations",
];
