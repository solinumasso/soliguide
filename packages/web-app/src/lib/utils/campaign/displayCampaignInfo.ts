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
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  campaignIsActive,
  CampaignStatus,
  getDepartmentCodeFromPostalCode,
  getPosition,
  type ApiPlace,
  type SoliguideCountries
} from '@soliguide/common';

import { differenceInHours } from 'date-fns';

export const displayCampaignInfo = (place: ApiPlace, isExternal: boolean): boolean => {
  const campaignInfo = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME];
  const campaign = place.campaigns[CAMPAIGN_DEFAULT_NAME];
  const hasCampaignDisplayStarted =
    differenceInHours(new Date(), campaignInfo.dateDebutAffichage) > 0;

  if (isExternal) {
    const position = getPosition(place);

    if (!position?.postalCode || !position?.country) {
      return false;
    }
    const { postalCode } = position;
    const { country } = position;

    return (
      campaignIsActive([
        getDepartmentCodeFromPostalCode(country as SoliguideCountries, postalCode)
      ]) && hasCampaignDisplayStarted
    );
  }

  return (
    campaignIsActive() &&
    hasCampaignDisplayStarted &&
    campaign.toUpdate &&
    campaign.status !== CampaignStatus.FINISHED
  );
};
