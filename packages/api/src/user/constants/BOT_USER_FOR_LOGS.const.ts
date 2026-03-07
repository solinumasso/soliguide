import { SupportedLanguagesCode, UserStatus } from "@soliguide/common";

import { Origin, UserForLogs } from "../../_models";

export const BOT_USER_FOR_LOGS: UserForLogs = {
  email: "tech@solinum.org",
  language: SupportedLanguagesCode.FR,
  orgaId: null,
  orgaName: null,
  origin: Origin.SOLIGUIDE,
  referrer: null,
  role: null,
  status: UserStatus.SOLI_BOT,
  territory: null,
  userName: "Bot Soliguide",
  user_id: null,
};
