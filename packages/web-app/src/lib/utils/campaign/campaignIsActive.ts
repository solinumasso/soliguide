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
import { CAMPAIGN_DEFAULT_NAME, CAMPAIGN_LIST, type AnyDepartmentCode } from '@soliguide/common';

export const campaignIsActive = (territories?: AnyDepartmentCode[]): boolean => {
  const today = new Date();

  // eslint-disable-next-line fp/no-let
  let isTerritoryInCampaign = !territories?.length;

  if (territories?.length) {
    // eslint-disable-next-line fp/no-mutation
    isTerritoryInCampaign = territories.some((territory) =>
      CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].territories.includes(territory)
    );
  }

  return (
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateDebutCampagne <= today &&
    today <= CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateFin &&
    isTerritoryInCampaign
  );
};
