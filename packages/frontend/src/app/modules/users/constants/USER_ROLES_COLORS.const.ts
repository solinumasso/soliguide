import { UserRole } from "@soliguide/common";

export const USER_ROLES_COLORS: {
  [key in UserRole]: string;
} = {
  OWNER: "primary",
  EDITOR: "secondary",
  READER: "info",
};
