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
import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message = "Remove campaign email tracking fields from users campaigns";

const CAMPAIGN_PERIODS = [
  "MAJ_ETE_2022",
  "MAJ_ETE_2023",
  "MAJ_ETE_2024",
  "MAJ_HIVER_2022",
  "MAJ_HIVER_2023",
  "END_YEAR_2024",
  "MID_YEAR_2025",
  "END_YEAR_2025",
  "UKRAINE_2022",
];

const EMAIL_FIELDS = [
  "CAMPAGNE_COMPTES_PRO",
  "CAMPAGNE_INVITATIONS",
  "RELANCE_CAMPAGNE_COMPTES_PRO",
  "RELANCE_CAMPAGNE_INVITATIONS",
  "RELANCE_DESESPOIR_COMPTES_PRO",
  "RELANCE_DESESPOIR_INVITATIONS",
  "RELANCE_TERMINER_MAJ",
  "lastEmailStatus",
];

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("users");

  const unsetFields: Record<string, string> = {};
  for (const period of CAMPAIGN_PERIODS) {
    for (const field of EMAIL_FIELDS) {
      unsetFields[`campaigns.${period}.${field}`] = "";
    }
  }

  const result = await collection.updateMany({}, { $unset: unsetFields });

  logger.info(`[MIGRATION] - Updated ${result.modifiedCount} documents`);
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info(
    "[ROLLBACK] - Cannot restore campaign email data, fields were removed permanently"
  );
};
