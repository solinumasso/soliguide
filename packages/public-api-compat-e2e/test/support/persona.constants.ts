import { UserStatus, UserStatusNotLogged } from "@soliguide/common";

import { PersonaContext, PersonaKey } from "./compatibility.types";

export const SEARCH_PERSONA_KEYS: PersonaKey[] = [
  "NOT_LOGGED",
  // "API_USER",
  "PRO",
  "SIMPLE_USER",
  "VOLUNTEER",
  "WIDGET_USER",
  "SOLI_BOT",
];

export const PERSONA_STATUS_BY_KEY: Record<
  PersonaKey,
  PersonaContext["status"]
> = {
  NOT_LOGGED: UserStatusNotLogged.NOT_LOGGED,
  API_USER: UserStatus.API_USER,
  PRO: UserStatus.PRO,
  SIMPLE_USER: UserStatus.SIMPLE_USER,
  VOLUNTEER: UserStatus.VOLUNTEER,
  WIDGET_USER: UserStatus.WIDGET_USER,
  SOLI_BOT: UserStatus.SOLI_BOT,
};
