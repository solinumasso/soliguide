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
import { PlaceModel } from "../../place/models";
import { UserModel } from "../../user/models/user.model";
import { logger } from "../../general/logger";

export interface ResetAirtableSyncResult {
  lieuxModified: number;
  usersModified: number;
}

export const resetAirtableSync = async (): Promise<ResetAirtableSyncResult> => {
  const filterExcluded = {
    "atSync.excluded": false,
  };

  const update = {
    $set: { "atSync.lastSync": null },
  };

  // Reset lieux collection
  const lieuxResult = await PlaceModel.updateMany(filterExcluded, update);
  logger.info(`[LIEUX] Number of lieux modified: ${lieuxResult.modifiedCount}`);

  // Reset users collection
  const usersResult = await UserModel.updateMany(filterExcluded, update);
  logger.info(`[USERS] Number of users modified: ${usersResult.modifiedCount}`);

  return {
    lieuxModified: lieuxResult.modifiedCount,
    usersModified: usersResult.modifiedCount,
  };
};
