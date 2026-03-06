import {
  ApiPlace,
  CAMPAIGN_DEFAULT_NAME,
  CampaignPlaceAutonomy,
  UserStatus,
} from "@soliguide/common";

import { updatePlaceByPlaceId } from "../../place/services/admin-place.service";
import { ModelWithId, UserForLogs } from "../../_models";

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
