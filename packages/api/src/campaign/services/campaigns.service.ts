import { CampaignLifecycleStatus, type Campaign } from "@soliguide/common";

import { CampaignModel } from "../models/campaign.model";

export const findActiveCampaignBySlug = async (
  slug: string
): Promise<Campaign | null> => {
  return CampaignModel.findOne({
    slug,
    status: CampaignLifecycleStatus.ACTIVE,
  }).lean();
};
