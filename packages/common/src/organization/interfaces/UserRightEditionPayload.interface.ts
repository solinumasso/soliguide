import { UserRole } from "../../users";

export interface UserRightEditionPayload {
  userObjectId: string;
  allPlaces: boolean;
  isInvitation: boolean;
  places: number[];
  role: UserRole;
}
