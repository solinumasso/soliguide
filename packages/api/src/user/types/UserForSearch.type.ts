import { User } from "../interfaces";

export type UserForSearch = Pick<
  User,
  | "name"
  | "status"
  | "verified"
  | "territories"
  | "categoriesLimitations"
  | "areas"
>;
