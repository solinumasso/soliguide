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
  ApiPlace,
  CampaignPlaceAutonomy,
  CampaignStatus,
  PlaceChangesSection,
  PlaceStatus,
  PlaceType,
  CampaignChangesSection,
} from "@soliguide/common";

import mongoose, { ClientSession } from "mongoose";

import {
  CampaignSteps,
  ModelWithId,
  OrganizationPopulate,
} from "../../_models";

import {
  searchOrgas,
  updateOrga,
} from "../../organization/services/organization.service";

import { saveTempChanges } from "../../place-changes/controllers/place-changes.controller";

import { updatePlaceByPlaceId } from "../../place/services/admin-place.service";
import { UserForLogs } from "../../user/interfaces";

export const setNoChangeForPlace = async (
  lieu_id: number,
  placeStatus: PlaceStatus
) => {
  const update: any = {};
  const path = `campaigns.${CAMPAIGN_DEFAULT_NAME}`;

  update[path + ".general"] = {
    changes: false,
    endDate: new Date(),
    startDate: new Date(),
    updated: true,
  };

  update[path + ".sections"] = {
    tempClosure: {
      changes: false,
      date: new Date(),
      updated: true,
    },
    hours: {
      changes: false,
      date: new Date(),
      updated: true,
    },
    services: {
      changes: false,
      date: new Date(),
      updated: true,
    },
    tempMessage: {
      changes: false,
      date: new Date(),
      updated: true,
    },
  };

  update[path + ".currentStep"] = 4;
  update[path + ".status"] = CampaignStatus.FINISHED;

  const updatedPlace = await updatePlaceByPlaceId(
    lieu_id,
    update,
    true,
    placeStatus
  );

  return updatedPlace;
};

export const updateCampaignSection = async (
  place: ApiPlace,
  section: CampaignChangesSection,
  changes: boolean
): Promise<ModelWithId<ApiPlace>> => {
  const sectionToUpdate =
    section === CampaignChangesSection.tempHours
      ? `campaigns.${CAMPAIGN_DEFAULT_NAME}.sections.hours`
      : `campaigns.${CAMPAIGN_DEFAULT_NAME}.sections.${section}`;

  const stepValues: CampaignSteps = {
    [CampaignChangesSection.services]: 3,
    [CampaignChangesSection.tempClosure]:
      place.placeType === PlaceType.PLACE ? 1 : 2, // If we're updating a mobile service, we skip the hours step
    [CampaignChangesSection.tempHours]: 2,
    [CampaignChangesSection.tempMessage]: 4,
  };

  const currentStep =
    place.campaigns[CAMPAIGN_DEFAULT_NAME].currentStep !== 4
      ? stepValues[section]
      : 4;

  const toUpdate: any = {
    [sectionToUpdate]: {
      changes,
      date: new Date(),
      updated: true,
    },
  };

  toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.currentStep`] = currentStep;

  if (section === CampaignChangesSection.tempMessage) {
    toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`] =
      place.campaigns[CAMPAIGN_DEFAULT_NAME].general.updated ||
      (place.campaigns[CAMPAIGN_DEFAULT_NAME].sections.tempClosure.updated &&
        ((place.placeType === PlaceType.PLACE &&
          place.campaigns[CAMPAIGN_DEFAULT_NAME].sections.hours.updated) ||
          place.placeType === PlaceType.ITINERARY) &&
        place.campaigns[CAMPAIGN_DEFAULT_NAME].sections.services.updated);

    toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.changes`] =
      place.campaigns[CAMPAIGN_DEFAULT_NAME].sections.tempClosure.changes ||
      (place.placeType === PlaceType.PLACE &&
        place.campaigns[CAMPAIGN_DEFAULT_NAME].sections.hours.changes) ||
      place.placeType === PlaceType.ITINERARY ||
      place.campaigns[CAMPAIGN_DEFAULT_NAME].sections.services.changes ||
      changes;
  }

  if (
    !place.campaigns[CAMPAIGN_DEFAULT_NAME].general.updated &&
    toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`]
  ) {
    toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.endDate`] = new Date();
  }

  if (
    place.campaigns[CAMPAIGN_DEFAULT_NAME].status === CampaignStatus.TO_DO &&
    section === CampaignChangesSection.tempClosure
  ) {
    toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.startDate`] =
      new Date();
  }

  toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.status`] =
    place.campaigns[CAMPAIGN_DEFAULT_NAME].general.updated ||
    toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.updated`]
      ? CampaignStatus.FINISHED
      : place.campaigns[CAMPAIGN_DEFAULT_NAME].general.startDate ||
        toUpdate[`campaigns.${CAMPAIGN_DEFAULT_NAME}.general.startDate`]
      ? CampaignStatus.STARTED
      : CampaignStatus.TO_DO;

  const updatedPlace = await updatePlaceByPlaceId(
    place.lieu_id,
    toUpdate,
    true,
    place.status
  );

  return updatedPlace;
};

export const setRemindMeLater = async (
  place: ApiPlace,
  date: Date,
  user: UserForLogs
): Promise<ModelWithId<ApiPlace>> => {
  const update: { [key: string]: Date } = {};

  update[`campaigns.${CAMPAIGN_DEFAULT_NAME}.remindMeDate`] = date;

  const updatedPlace = await updatePlaceByPlaceId(
    place.lieu_id,
    update,
    true,
    place.status
  );

  await saveTempChanges(
    PlaceChangesSection.remindMe,
    place,
    updatedPlace,
    user,
    false,
    true
  );

  return updatedPlace;
};

export const organizationContentToUpdate = (
  organization: OrganizationPopulate
): {
  autonomyRate: number;
  endDate: Date | null;
  startDate: Date | null;
  status: CampaignStatus;
  toUpdate: boolean;
} => {
  const nPlacesToUpdate = organization.places.reduce(
    (n: number, place: ApiPlace) => {
      if (place.campaigns[CAMPAIGN_DEFAULT_NAME]?.toUpdate) {
        n += 1;
      }
      return n;
    },
    0
  );

  const toUpdate = nPlacesToUpdate > 0;
  const nPlacesUpdated = toUpdate
    ? organization.places.reduce((n: number, place: ApiPlace) => {
        if (place.campaigns[CAMPAIGN_DEFAULT_NAME].general.updated) {
          n += 1;
        }
        return n;
      }, 0)
    : 0;

  const status =
    toUpdate && nPlacesUpdated
      ? nPlacesToUpdate === nPlacesUpdated
        ? CampaignStatus.FINISHED
        : CampaignStatus.STARTED
      : CampaignStatus.TO_DO;

  const nAutonomousPlaces = nPlacesUpdated
    ? organization.places.reduce((n: number, place: ApiPlace) => {
        if (
          place.campaigns[CAMPAIGN_DEFAULT_NAME].autonomy ===
          CampaignPlaceAutonomy.AUTONOMOUS
        ) {
          n += 1;
        }
        return n;
      }, 0)
    : 0;

  const autonomyRate: number = toUpdate
    ? Math.floor((nAutonomousPlaces / nPlacesToUpdate) * 100)
    : 0;

  const startDate =
    !organization.campaigns[CAMPAIGN_DEFAULT_NAME].startDate &&
    status !== CampaignStatus.TO_DO
      ? new Date()
      : null;

  const endDate = status === CampaignStatus.FINISHED ? new Date() : null;

  return {
    autonomyRate,
    endDate,
    startDate,
    status,
    toUpdate,
  };
};

export const updateOrganizationCampaign = async (
  placeId: mongoose.Types.ObjectId,
  session?: ClientSession
): Promise<void> => {
  // Looking for organizations linked to the place
  const organizations = await searchOrgas({
    places: { $in: [placeId] },
    session,
  });

  // On each organization:
  for (const organization of organizations) {
    const content = organizationContentToUpdate(organization);

    await updateOrga(
      { organization_id: organization.organization_id },
      {
        [`campaigns.${CAMPAIGN_DEFAULT_NAME}`]: content,
      },
      session
    );
  }
};
