import type { User } from "../../src/_models";
import { UserStatus } from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";

export const USER_SIMPLE: User = {
  ...ABSTRACT_USER,
  ...{
    updatedAt: new Date("2021-11-17T11:45:41.165"),
    createdAt: new Date("2021-11-17T11:45:41.165"),
    lastname: "Nom simple utilisateur",
    mail: "simple-utilisateur@soliguide.dev",
    name: "Prénom simple utilisateur",
    status: UserStatus.SIMPLE_USER,
    territories: ["93"],
    user_id: 123456789,
    lastLogin: new Date("2025-11-17T11:45:41.165"),
  },
};
