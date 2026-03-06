import { UserRole } from "@soliguide/common";
import { UserSignup } from "../../users/types";

export type InvitationFormData = UserSignup & {
  role: UserRole;
  organization: string;
  places: string[];
};
