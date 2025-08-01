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
import mongoose, { FilterQuery } from "mongoose";
import type { Logger } from "pino";

import {
  CAMPAIGN_DEFAULT_NAME,
  type ApiPlace,
  type CommonPlaceParcours,
  PlaceChangesSection,
  PlaceType,
  TempInfoType,
  UserStatus,
  CommonPlacePosition,
  type CommonPlaceSource,
  type CommonNewPlaceService,
  type PlaceSourceId,
  PositionSlugs,
  getPosition,
  checkIfSourceMustBeDisplayed,
} from "@soliguide/common";

import {
  addNewPlace,
  deletePlaceById,
  getNextPlaceId,
  updatePlaceByPlaceId,
  updateServices,
} from "../services/admin-place.service";
import {
  isPlaceOpenToday,
  getHoursFromParcours,
  removeFieldFromPlaceForDuplication,
} from "../utils";

import type {
  ApiPlacePhoto,
  ExpressRequest,
  ModelWithId,
  OrganizationPopulate,
  UserForLogs,
  UserPopulateType,
} from "../../_models";

import type { BodySource } from "../interfaces";
import {
  adminTerritoryCanAccessToTerritory,
  generateSlugForPlaceInfo,
  seoUrl,
} from "../../_utils";

import { isPlaceToUpdate } from "../../campaign/services/places.service";
import { PlaceChanges } from "../../place-changes/interfaces/PlaceChanges.interface";
import { logger as defaultLogger } from "../../general/logger";
import { addPlaceToOrga } from "../../organization/controllers/manage-places-and-users.controller";
import { searchOrgas, pullElementFromOrga } from "../../organization/services";

import {
  saveTempChanges,
  savePatchChanges,
} from "../../place-changes/controllers/place-changes.controller";

import {
  patchTempInfoByType,
  removeServiceClosure,
} from "../../temp-info/controllers/temp-info.controller";
import { deleteTempInfoByParams } from "../../temp-info/services/temp-info.service";
import { deleteTranslationsForPlace } from "../../translations/services/translatedField.service";
import { deleteUserRightsWithParams } from "../../user/services";
import { getPriorityForPlace } from "../utils/getPriorityForPlace";
import {
  updateOrganizationCampaign,
  computePlaceAutonomyStatus,
  isCampaignActiveForPlace,
} from "../../campaign/controllers";

import { patchPositionForTranslations } from "../../translations/controllers/translation.controller";

/**
 * @param {ModelWithId<ApiPlace>} updatedPlace Newly updated place
 * @param {ModelWithId<ApiPlace>} oldPlace Old version of the place
 * @returns Place updated if it's status changed as part of the campaign
 */
const changeCampaignUpdateStatus = async (
  updatedPlace: ModelWithId<ApiPlace>,
  oldPlace: ModelWithId<ApiPlace>
): Promise<ModelWithId<ApiPlace>> => {
  const lieu_id = updatedPlace.lieu_id;
  const toCampaignUpdate = await isPlaceToUpdate(lieu_id);

  let reUpdatedPlace = updatedPlace;
  if (updatedPlace._id) {
    // We update info on the place's organization
    await updateOrganizationCampaign(
      new mongoose.Types.ObjectId(updatedPlace._id)
    );

    if (
      oldPlace.campaigns[CAMPAIGN_DEFAULT_NAME].toUpdate !== toCampaignUpdate
    ) {
      reUpdatedPlace = await updatePlaceByPlaceId(
        lieu_id,
        { [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: toCampaignUpdate },
        true,
        updatedPlace.status
      );
    }
  }

  return reUpdatedPlace;
};

export const insertPlace = async (
  newPlace: Partial<ApiPlace>
): Promise<ModelWithId<ApiPlace>> => {
  // Increment lieu_id (unique)
  newPlace.lieu_id = await getNextPlaceId();

  // Generate Seo URL
  newPlace.seo_url = seoUrl(newPlace);

  // Used by the search features
  newPlace.slugs = generateSlugForPlaceInfo(newPlace);

  if (newPlace.services_all && newPlace.status) {
    newPlace.priority = getPriorityForPlace(
      newPlace.services_all,
      newPlace.status
    );
  }

  // Create the place based on the data
  return await addNewPlace(newPlace);
};

export const addPlace = async (
  placeToCreate: Partial<ApiPlace>,
  userForLogs: UserForLogs,
  authUser: UserPopulateType,
  isAdmin: boolean,
  organization: OrganizationPopulate
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const newPlace = await insertPlace({
    ...placeToCreate,
    createdBy: userForLogs?.userName,
  });

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.new,
    null,
    newPlace,
    userForLogs as UserForLogs,
    true
  );

  // Add place to organization
  if (authUser.status === UserStatus.PRO) {
    organization = authUser.organizations[authUser?.selectedOrgaIndex ?? 0];
    await addPlaceToOrga(newPlace, organization);
  } else if (organization && isAdmin) {
    await addPlaceToOrga(newPlace, organization);
  }

  return { placeChanges, updatedPlace: newPlace };
};

/**
 * patchInfos - Update general infos
 * @param {Object} data see ./dto/info.dto.ts
 */
export const patchInfos = async (
  req: ExpressRequest,
  data: Partial<ApiPlace>
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const oldPlace = req.lieu;

  // Used by the search feature
  const generatedSlugs = generateSlugForPlaceInfo(data);

  const updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    {
      ...data,
      slugs: {
        infos: {
          name: generatedSlugs.infos.name,
          description: generatedSlugs.infos.description,
        },
      },
      "stepsDone.infos": true,
    },
    req.bodyValidated.forceChanges,
    oldPlace.status
  );

  if (!updatedPlace) {
    throw new Error("PLACE_DOES_NOT_EXIST");
  }

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.generalinfo,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges
  );

  return { placeChanges, updatedPlace };
};

export const patchPosition = async (
  req: ExpressRequest,
  position: CommonPlacePosition
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  //TODO: check if you can add a place

  const oldPlace = req.lieu;
  position = new CommonPlacePosition(position);

  if (!position?.country) {
    throw new Error("COUNTRY_NOT_FOUND");
  }

  if (
    position.country &&
    !adminTerritoryCanAccessToTerritory(
      req.user,
      { ...req.lieu, position, parcours: [], placeType: PlaceType.PLACE },
      position.country
    )
  ) {
    throw new Error("CANNOT_ADD_PLACE_IN_THIS_TERRITORY");
  }

  let updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    {
      parcours: [],
      placeType: PlaceType.PLACE,
      position,

      "stepsDone.emplacement": true,
    },
    req.bodyValidated.forceChanges,
    oldPlace.status
  );

  await patchPositionForTranslations(updatedPlace);

  // Save logs
  const placeChanges = await savePatchChanges(
    PlaceChangesSection.emplacement,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges
  );

  // We check whether this place has to be updated as part of the campaign when the campaign is on
  if (isCampaignActiveForPlace(updatedPlace)) {
    updatedPlace = await changeCampaignUpdateStatus(updatedPlace, oldPlace);
  }

  return { placeChanges, updatedPlace };
};

/**
 * patchHours - Update Place users
 * @param {Object} req see ../../fiche/dto/contacts.dto.ts
 */
export const patchContacts = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const oldPlace = req.lieu;
  const contacts = req.bodyValidated;

  const lieu_id = req.lieu.lieu_id;

  const updatedPlace = await updatePlaceByPlaceId(
    lieu_id,
    { "stepsDone.contacts": true },
    true,
    req.lieu.status
  );

  oldPlace.contacts = contacts.newPlaceContacts;

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.contacts,
    oldPlace,
    {
      ...updatedPlace,
      contacts: contacts.oldPlaceContacts,
    } as ApiPlace,
    req.userForLogs as UserForLogs,
    true
  );

  return { placeChanges, updatedPlace };
};

/**
 * patchPhotos - Update Place Photo
 * @param {Object} req
 */
// TODO: add pictures as soon as they are uploaded
export const patchPhotos = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const oldPlace = req.lieu;
  const photos = req.body;

  photos.forEach((photo: ApiPlacePhoto, index: number) => {
    photos[index] = new mongoose.Types.ObjectId(photo._id);
  });

  const updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    { photos, "stepsDone.photos": true },
    true,
    req.lieu.status
  );

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.photos,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    true
  );

  return { placeChanges, updatedPlace };
};

/**
 * patchHours - Update Place Hours
 * @param {Object} req see ./dto/hours.dto.ts
 */
export const patchHours = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const updatedHours = req.bodyValidated.newhours;
  const oldPlace = req.lieu;

  const lieu_id = oldPlace.lieu_id;
  const status = oldPlace.status;

  delete updatedHours.h24;

  const toUpdate = {
    newhours: updatedHours,
    "stepsDone.horaires": true,
  };

  toUpdate.newhours.closedHolidays = updatedHours.closedHolidays;

  let updatedPlace = await updatePlaceByPlaceId(
    lieu_id,
    toUpdate,
    req.bodyValidated.forceChanges,
    status
  );

  if (getPosition(updatedPlace)?.country) {
    const isOpenToday = await isPlaceOpenToday(updatedPlace);

    updatedPlace = await updatePlaceByPlaceId(
      lieu_id,
      { isOpenToday },
      req.bodyValidated.forceChanges
    );
  }

  updatedPlace = await updateServices(
    updatedPlace,
    req.bodyValidated.forceChanges
  );

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.hours,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges
  );

  return { placeChanges, updatedPlace };
};

/**
 * patchPublics - Update welcomed publics
 * @param {Object} req see ./dto/publics.dto.ts
 */
export const patchPublics = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const oldPlace = req.lieu;
  const publics = req.bodyValidated.publics;
  const languages = req.bodyValidated.languages;

  const place = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    {
      languages,
      publics,
      "stepsDone.publics": true,
    },
    req.bodyValidated.forceChanges,
    oldPlace.status
  );
  const isCampaign = req.bodyValidated?.isCampaign ?? false;
  const updatedPlace = await updateServices(place);

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.public,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges,
    isCampaign
  );

  return { placeChanges, updatedPlace };
};

/**
 * patchModalities - Update place access conditions
 */
export const patchModalities = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const oldPlace = req.lieu;
  const modalities = req.bodyValidated.modalities;

  const place = await updatePlaceByPlaceId(
    req.lieu.lieu_id,
    {
      modalities,
      "stepsDone.conditions": true,
    },
    req.bodyValidated.forceChanges,
    req.lieu.status
  );

  const updatedPlace = await updateServices(place);

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.modalities,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges
  );

  return { placeChanges, updatedPlace };
};

/**
 * patchServices - Update Place Services
 */
export const patchServices = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const oldPlace = req.lieu;
  const oldServices = oldPlace.services_all;
  const updatedServices = req.bodyValidated.services_all;
  const priority = getPriorityForPlace(updatedServices, oldPlace.status);

  let updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    {
      priority,
      services_all: updatedServices,
      "stepsDone.services": true,
    },
    req.bodyValidated.forceChanges,
    oldPlace.status
  );

  const updatedServiceObjectIds = updatedServices
    .filter((service: CommonNewPlaceService) => service?.serviceObjectId)
    .map((service: CommonNewPlaceService) =>
      service?.serviceObjectId.toString()
    );

  for (const service of oldServices) {
    // If a service has been removed we delete all temporary information associated to it
    if (!updatedServiceObjectIds.includes(service.serviceObjectId.toString())) {
      await deleteTempInfoByParams(
        { serviceObjectId: service.serviceObjectId },
        false
      );
    }
  }

  for (const service of updatedServices) {
    if (service.close.actif) {
      await patchTempInfoByType(
        { ...service.close, tempInfoType: TempInfoType.SERVICE_CLOSURE },
        updatedPlace,
        req.userForLogs as UserForLogs,
        service
      );
    } else {
      // When we ourselves manually remove a closure, we remove it
      await removeServiceClosure(service);
    }
  }

  updatedPlace = await updateServices(updatedPlace);

  // We check whether this place has to be updated as part of the campaign when the campaign is on
  if (isCampaignActiveForPlace(updatedPlace)) {
    updatedPlace = await changeCampaignUpdateStatus(updatedPlace, oldPlace);
  }

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.services,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges
  );

  return { placeChanges, updatedPlace };
};

export const patchStatus = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const newStatus = req.bodyValidated.status;
  const oldPlace = req.lieu;

  const lieu_id = oldPlace.lieu_id;
  const oldStatus = oldPlace.status;

  const priority = getPriorityForPlace(oldPlace.services_all, newStatus);

  let updatedPlace = await updatePlaceByPlaceId(
    lieu_id,
    { priority, status: newStatus },
    req.bodyValidated.forceChanges,
    oldStatus
  );

  if (getPosition(updatedPlace)?.country) {
    const isOpenToday = await isPlaceOpenToday(updatedPlace);
    updatedPlace = await updatePlaceByPlaceId(lieu_id, { isOpenToday });
  }
  updatedPlace = await updateServices(updatedPlace);

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.status,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges
  );

  // We check whether this place has to be updated as part of the campaign when the campaign is on
  if (isCampaignActiveForPlace(updatedPlace)) {
    updatedPlace = await changeCampaignUpdateStatus(updatedPlace, oldPlace);
  }

  return { placeChanges, updatedPlace };
};

/**
 * @param  {Object} req
 */
export const patchVisibility = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const oldPlace = req.lieu;

  const updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    { visibility: req.bodyValidated.visibility },
    req.bodyValidated.forceChanges,
    oldPlace.status
  );

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.visibility,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges
  );

  return { placeChanges, updatedPlace };
};

export const patchCampaignSource = async (
  req: ExpressRequest
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const oldPlace = req.lieu;

  const updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    {
      [`campaigns.${CAMPAIGN_DEFAULT_NAME}.source`]: req.bodyValidated.source,
    },
    true,
    oldPlace.status
  );

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.CAMPAIGN_SOURCE_MAJ,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    true
  );

  return { placeChanges, updatedPlace };
};

export const setNoChangeForPlace = async (
  place: ApiPlace,
  userForLogs: UserForLogs
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  let updatedPlace = await updatePlaceByPlaceId(
    place.lieu_id,
    {},
    true,
    place.status
  );

  const placeChanges = await saveTempChanges(
    PlaceChangesSection.place,
    place,
    place,
    userForLogs,
    true
  );

  // We update the autonomy status if necessary when the campaign is on
  if (isCampaignActiveForPlace(updatedPlace)) {
    updatedPlace = await computePlaceAutonomyStatus(updatedPlace, userForLogs);
  }

  return { updatedPlace, placeChanges };
};

export const duplicatePlace = async (
  place: ApiPlace,
  userForLogs: UserForLogs
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const templatePlace = removeFieldFromPlaceForDuplication(place);

  // Increment lieu_id (unique)
  templatePlace.lieu_id = await getNextPlaceId();

  // Add 'Copie' to the place name
  templatePlace.name = `${place.name} - Copie`;

  // Generate Seo Url
  templatePlace.seo_url = seoUrl(templatePlace);

  // Field used for the search
  templatePlace.slugs = generateSlugForPlaceInfo(templatePlace);
  if (templatePlace.position) {
    templatePlace.position.slugs = new PositionSlugs(templatePlace.position);

    if (getPosition(templatePlace)?.country) {
      // We recalculate if the place is open today as we remove temporary infos from it
      templatePlace.isOpenToday = await isPlaceOpenToday(templatePlace);
    }
  }

  // Create new place from data
  const newPlace = await addNewPlace({
    ...templatePlace,
    createdBy: userForLogs.userName,
  });

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.new,
    null,
    newPlace,
    userForLogs,
    true
  );

  return { placeChanges, updatedPlace: newPlace };
};

export const deletePlace = async (
  place: ModelWithId<ApiPlace>,
  logger: Logger = defaultLogger
): Promise<void> => {
  await deleteUserRightsWithParams({
    place: place._id,
  });

  if (place?._id) {
    // We update the campaign information of the associated organizations when the campaign is on
    if (isCampaignActiveForPlace(place)) {
      await updateOrganizationCampaign(new mongoose.Types.ObjectId(place._id));
    }

    // We remove all temporary information associated to this place
    await deleteTempInfoByParams({ place: place._id }, false);
  }

  const orgas = await searchOrgas(
    { places: { $in: [place._id] } },
    {
      limit: 2000,
      page: 1,
      skip: 0,
      sort: { createdAt: "descending" },
    }
  );

  logger.info("Deletes the place from all the organizations");

  for (const organization of orgas) {
    await pullElementFromOrga([organization._id], "places", [place._id]);
  }

  logger.info("Deletes associated translations");

  await deleteTranslationsForPlace(place.lieu_id);

  await deletePlaceById(place._id);
};

export const patchParcours = async (
  req: ExpressRequest & {
    lieu: Required<ApiPlace>;
  }
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  // We must eliminate 'forceChanges' from parcoursObject
  const parcoursObject = { ...req.bodyValidated };
  delete parcoursObject.forceChanges;

  const oldPlace = req.lieu;

  const lieu_id = oldPlace.lieu_id;

  const parcours: CommonPlaceParcours[] = [];

  const parcoursIndexes: string[] = Object.keys(parcoursObject);

  for (const i of parcoursIndexes) {
    const index = parseInt(i, 10);

    parcours.push(parcoursObject[index]);

    parcours[index].photos = parcoursObject[index].photos.map(
      (photo: ApiPlacePhoto) => new mongoose.Types.ObjectId(photo._id)
    );

    parcours[index].position = new CommonPlacePosition(
      parcours[index].position
    );
  }

  const newhours = getHoursFromParcours(parcours);

  const dataToUpdate: Partial<ApiPlace> = {
    newhours,
    parcours,
    placeType: PlaceType.ITINERARY,
    stepsDone: { ...req.lieu.stepsDone, emplacement: true },
  };

  let updatedPlace = await updatePlaceByPlaceId(
    lieu_id,
    dataToUpdate,
    req.bodyValidated.forceChanges,
    oldPlace.status
  );

  if (getPosition(updatedPlace)?.country) {
    const isOpenToday = await isPlaceOpenToday(updatedPlace);

    updatedPlace = await updatePlaceByPlaceId(lieu_id, { isOpenToday });
  }
  updatedPlace = await updateServices(updatedPlace);

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.emplacement,
    oldPlace,
    updatedPlace,
    req.userForLogs as UserForLogs,
    req.bodyValidated.forceChanges
  );

  // We check whether this place has to be updated as part of the campaign when the campaign is on
  if (isCampaignActiveForPlace(updatedPlace)) {
    updatedPlace = await changeCampaignUpdateStatus(updatedPlace, oldPlace);
  }

  return { placeChanges, updatedPlace };
};

export const putSource = async (
  newSource: BodySource,
  forceChanges: boolean,
  oldPlace: ApiPlace,
  userForLogs: UserForLogs
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const update: FilterQuery<ApiPlace> = {};
  const sources: CommonPlaceSource[] = oldPlace.sources ?? [];

  const existingSource = sources.find(
    (item: CommonPlaceSource) => item.name === newSource.name
  );

  if (
    existingSource &&
    !existingSource.ids.some(
      (placeSource: PlaceSourceId) => placeSource.id === newSource.id
    )
  ) {
    existingSource.ids.push({
      id: newSource.id,
      url: newSource.url ?? undefined,
    });
  }
  if (!existingSource) {
    sources.push({
      ids: [{ id: newSource.id, url: newSource.url ?? undefined }],
      isOrigin: newSource.isOrigin,
      license: newSource.license ?? undefined,
      name: newSource.name,
    });
  }

  update.sources = sources;

  if (
    sources.some((source) =>
      checkIfSourceMustBeDisplayed(source.name, source.isOrigin)
    )
  ) {
    update[`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`] = false;
  }

  const updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    update,
    false,
    oldPlace.status
  );

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.sources,
    oldPlace,
    updatedPlace,
    userForLogs,
    forceChanges
  );

  return { placeChanges, updatedPlace };
};

export const deleteSource = async (
  delSource: BodySource,
  forceChanges: boolean,
  oldPlace: ApiPlace,
  userForLogs: UserForLogs
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const sources = oldPlace.sources ?? [];

  const existingSources = sources.find(
    (item: CommonPlaceSource) => item.name === delSource.name
  );

  if (existingSources) {
    existingSources.ids = existingSources.ids.filter(
      (placeSource: PlaceSourceId) => placeSource.id !== delSource.id
    );
    if (existingSources.ids.length === 0) {
      sources.splice(sources.indexOf(existingSources), 1);
    }
  }

  const updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    {
      sources,
    },
    false,
    oldPlace.status
  );

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.sources,
    oldPlace,
    updatedPlace,
    userForLogs,
    forceChanges
  );

  return { placeChanges, updatedPlace };
};

export const patchUpdateDate = async (
  updateDate: Date,
  oldPlace: ApiPlace
): Promise<ModelWithId<ApiPlace>> => {
  const updatedPlace = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    {
      updatedByUserAt: updateDate,
    },
    false,
    oldPlace.status
  );

  return updatedPlace;
};
