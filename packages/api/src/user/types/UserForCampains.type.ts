import { UserPopulate } from "../interfaces";

export type UserForCompaigns = Pick<UserPopulate, "user_id" | "mail" | "_id">;
