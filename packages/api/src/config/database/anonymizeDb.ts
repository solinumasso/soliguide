/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
