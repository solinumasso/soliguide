import { OrgaCampaignUpdates } from "./orgaCampaignUpdates.interface";

export class CampaignsForOrga {
  public runningCampaign: OrgaCampaignUpdates;

  constructor(runningCampaign?: OrgaCampaignUpdates) {
    this.runningCampaign = new OrgaCampaignUpdates(runningCampaign);
  }
}
