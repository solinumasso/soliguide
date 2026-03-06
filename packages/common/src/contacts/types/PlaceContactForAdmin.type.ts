import { UserStatus } from "../../users";
import { PlaceContact } from "../interfaces";

export type PlaceContactForAdmin = PlaceContact & {
  _id: string;
  canEdit: boolean; // Whether the user can show or mask someone else in the professional directory
  canEditUserInfos: boolean; // Whether the user can edit someone else information
  displayContactPro: boolean;
  edit?: boolean; // Edit in progress
  status: UserStatus;
  userObjectId: string;
};
