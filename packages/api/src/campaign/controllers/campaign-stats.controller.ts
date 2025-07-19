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
import {
  ApiPlace,
  CAMPAIGN_DEFAULT_NAME,
  CampaignPlaceAutonomy,
  UserStatus,
} from "@soliguide/common";

import { updatePlaceByPlaceId } from "../../place/services/admin-place.service";
import { ModelWithId } from "../../_models";
import { UserForLogs } from "../../user/interfaces";

export const computePlaceAutonomyStatus = async (
  place: ModelWithId<ApiPlace>,
  user: UserForLogs
): Promise<ModelWithId<ApiPlace>> => {
  let newAutonomy: CampaignPlaceAutonomy;
  const actualAutonomy = place.campaigns[CAMPAIGN_DEFAULT_NAME].autonomy;

  if (user.status !== UserStatus.PRO) {
    newAutonomy =
      actualAutonomy === CampaignPlaceAutonomy.AUTONOMOUS ||
      actualAutonomy === CampaignPlaceAutonomy.SEMI_AUTONOMOUS
        ? CampaignPlaceAutonomy.SEMI_AUTONOMOUS
        : CampaignPlaceAutonomy.NOT_AUTONOMOUS;
  } else {
    newAutonomy =
      actualAutonomy === CampaignPlaceAutonomy.AUTONOMOUS ||
      actualAutonomy === CampaignPlaceAutonomy.UNKNOWN
        ? CampaignPlaceAutonomy.AUTONOMOUS
        : CampaignPlaceAutonomy.SEMI_AUTONOMOUS;
  }

  if (actualAutonomy !== newAutonomy) {
    const autonomyToUpdate = {
      [`campaigns.${CAMPAIGN_DEFAULT_NAME}.autonomy`]: newAutonomy,
    };

    return updatePlaceByPlaceId(
      place.lieu_id,
      autonomyToUpdate,
      true,
      place.status
    );
  }

  return place;
};
