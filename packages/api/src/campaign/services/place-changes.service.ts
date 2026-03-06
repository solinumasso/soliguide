import { CAMPAIGN_DEFAULT_NAME } from "@soliguide/common";

import { PlaceChangesModel } from "../../place-changes/models/place-changes.model";

export const findUpdatedSectionsWithParams = async (params: any) => {
  return await PlaceChangesModel.aggregate([
    {
      $match: {
        campaignName: CAMPAIGN_DEFAULT_NAME,
        isCampaign: true,
        ...params,
      },
    },
    {
      // To calculate the autonomy level we only have to know if all forms sections have been exclusively modified by pros or not
      $group: {
        _id: "$userData.status",
        sections: { $addToSet: "$section" },
      },
    },
  ]);
};
