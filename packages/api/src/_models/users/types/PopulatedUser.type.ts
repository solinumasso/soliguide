import { User } from "../interfaces/User.interface";
import { ModelWithId } from "../../mongo/types/ModelWithId.type";

export type PopulatedUser = Pick<
  ModelWithId<User>,
  | "_id"
  | "invitations"
  | "lastname"
  | "lastLogin"
  | "mail"
  | "name"
  | "organizations"
  | "phone"
  | "status"
  | "title"
  | "territories"
  | "verified"
  | "user_id"
  | "areas"
>;
