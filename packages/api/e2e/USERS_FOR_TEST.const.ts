import { TestAccounts } from "./endPointTester.type";

export const ACCOUNTS_FOR_TEST: { [_key in TestAccounts]: string } = {
  USER_ADMIN_SOLIGUIDE: "admin-solinum@solinum.org",
  USER_ADMIN_TERRITORY: "admin.territory@soliguide.fr",
  USER_API_ALIMENTATION: "alimentation.api@soliguide.dev",
  USER_API_BLOCKED: "bloque.api@soliguide.dev",
  USER_API_DEFAULT: "default.api@soliguide.dev",
  USER_API_PARIS: "paris.api@soliguide.dev",
  USER_PRO_EDITOR: "editor@soliguide.dev",
  USER_PRO_OWNER: "admin@soliguide.dev",
  USER_PRO_OWNER_ORGA1_EDITOR_ORGA2: "owner.editor@soliguide.dev",
  USER_PRO_READER: "reader@soliguide.dev",
  USER_TRANSLATOR_EN_AR: "traducteur.enar@soliguide.dev",
};
