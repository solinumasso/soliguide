import { TranslatedFieldStatus } from "@soliguide/common";

import { CONFIG } from "../../_models";

import { hashPassword } from "../../_utils/random-generator.functions";
import { logger } from "../../general/logger";
import { TranslatedFieldModel } from "../../translations/models/translatedField.model";
import { UserModel } from "../../user/models/user.model";

export const anonymizeDb = async () => {
  logger.info("[ANON] [TRANSLATIONS] Disable waiting translations");
  await TranslatedFieldModel.updateMany(
    { status: TranslatedFieldStatus.NEED_AUTO_TRANSLATE },
    { $set: { status: TranslatedFieldStatus.DISABLED } }
  );

  logger.info("[ANON] [USER] Re-initialize passwords");
  const password = CONFIG.DEV_ANON_PASSWORD_FOR_ALL;

  await UserModel.updateMany(
    {},
    { $set: { password: await hashPassword(password) } }
  );

  // TODO: Remove phone numbers, use fake emails and remove real emails
  // Example: tech@solinum.org ====> solinum-001@fake-mail.fr
  logger.info("[ANON] Anonymization finished✅");
};
