import { type Campaign } from "@soliguide/common";

import { OrganizationPopulate, UserPopulateType } from "../../_models";
import { PlaceModel } from "../../place/models/place.model";
import {
  CampaignTempFormsPayload,
  CampaignTempFormsPlaceSummary,
} from "../interfaces";

/**
 * Assemble le payload GET une fois que la campagne + le user + ses userRights
 * sont résolus par les middlewares (`getActiveCampaignFromSlug`,
 * `getUserFromCampaignUuid`).
 *
 * Le tri des `place_id` éditables reprend la logique legacy `getPlaces` du
 * campaign controller : filtre `role !== READER` sur `user.userRights`. Rien
 * n'est requêté sur `userRights` en base ici — c'est le middleware qui les
 * a déjà populés.
 */
export const buildCampaignTempFormsPayload = async (
  campaign: Campaign,
  user: UserPopulateType
): Promise<CampaignTempFormsPayload> => {
  const placeIds = extractEditablePlaceIds(user);
  if (placeIds.length === 0) {
    return {
      campaign: pickCampaignPublicFields(campaign),
      user: { name: user.name },
      places: [],
    };
  }

  const places = await PlaceModel.find({ lieu_id: { $in: placeIds } })
    .select(
      "lieu_id seo_url name description status country position modalities newhours tempInfos -_id"
    )
    .lean<CampaignTempFormsPlaceSummary[]>();

  return {
    campaign: pickCampaignPublicFields(campaign),
    user: { name: user.name },
    places,
  };
};

export const extractEditablePlaceIds = (user: UserPopulateType): number[] => {
  const ids = new Set<number>();
  for (const right of user.userRights ?? []) {
    if (typeof right.place_id === "number") {
      ids.add(right.place_id);
    }
  }
  return [...ids];
};

const pickCampaignPublicFields = (
  campaign: Campaign
): CampaignTempFormsPayload["campaign"] => ({
  slug: campaign.slug,
  name: campaign.name,
  description: campaign.description ?? null,
  country: campaign.country,
  startDate: campaign.startDate,
  endDate: campaign.endDate,
  sectionsToUpdate: campaign.sectionsToUpdate,
});

/**
 * Variante orga du payload : projection identique à `buildCampaignTempFormsPayload`
 * mais scope = tous les lieux de l'organisation (peu importe `userRights`).
 * Consommé par la route admin `GET /admin/campaigns/:slug/orga/:orgaObjectId/climate`.
 */
export const buildCampaignTempFormsPayloadForOrga = async (
  campaign: Campaign,
  organization: OrganizationPopulate
): Promise<CampaignTempFormsPayload> => {
  const placeIds = (organization.places ?? [])
    .map((place) => place.lieu_id)
    .filter((id): id is number => typeof id === "number");

  if (placeIds.length === 0) {
    return {
      campaign: pickCampaignPublicFields(campaign),
      user: { name: organization.name },
      places: [],
    };
  }

  const places = await PlaceModel.find({ lieu_id: { $in: placeIds } })
    .select(
      "lieu_id seo_url name description status country position modalities newhours tempInfos -_id"
    )
    .lean<CampaignTempFormsPlaceSummary[]>();

  return {
    campaign: pickCampaignPublicFields(campaign),
    user: { name: organization.name },
    places,
  };
};
