import { SupportedLanguagesCode } from "../../translations";
import { UserRole, AllUserStatus } from "../../users";

export interface CommonUserForLogs {
  _id?: string;
  email: string;
  language?: SupportedLanguagesCode;
  orgaId: number | null;
  orgaName: string | null;
  referrer: string | null;
  role: UserRole | null;
  status: AllUserStatus;
  territory: string | null;
  user_id: number | null;
  userName: string;
}
