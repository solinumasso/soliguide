import { AllUserStatus, UserStatus } from "@soliguide/common";

export function isUserStatusInArray(
  userStatus: AllUserStatus,
  allowedStatuses: UserStatus[]
): boolean {
  return allowedStatuses.includes(userStatus as UserStatus);
}
