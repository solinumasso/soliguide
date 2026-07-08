import { type Campaign } from "@soliguide/common";

import { UserPopulateType } from "../../_models";
import { PlaceModel } from "../../place/models/place.model";

export interface CampaignTempFormsPlaceSummary {
  lieu_id: number;
  seo_url: string;
  name: string;
  description: string | null;
  status: unknown;
  country: unknown;
  position: unknown;
  modalities: unknown;
  newhours: unknown;
  tempInfos: unknown;
}

export interface CampaignTempFormsUserSummary {
  name: string;
}

export interface CampaignTempFormsPayload {
  campaign: Pick<
    Campaign,
    | "slug"
    | "name"
    | "description"
    | "country"
    | "startDate"
    | "endDate"
    | "sectionsToUpdate"
  >;
  user: CampaignTempFormsUserSummary;
  places: CampaignTempFormsPlaceSummary[];
}

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
