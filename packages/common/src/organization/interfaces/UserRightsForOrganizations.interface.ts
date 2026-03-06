import { UserRightStatus, UserRole } from "../../users";

export interface UserRightsForOrganizations {
  lastname: string;
  mail: string;
  name: string;
  places: number[];
  role: UserRole;
  status: UserRightStatus;
  user_id: number;
  userObjectId: string;
  verified: boolean;
}
