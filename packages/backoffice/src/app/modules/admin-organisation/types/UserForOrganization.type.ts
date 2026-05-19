import { CommonUser } from "@soliguide/common";

// Place version light pour les organisations
export type UserForOrganization = Pick<
  CommonUser,
  "_id" | "lastname" | "mail" | "name" | "user_id" | "verified"
>;
