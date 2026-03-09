import { UserStatus } from "../enums/UserStatus.enum";

export type KeyUserStatusValueString = {
  [key in UserStatus]: string;
};
