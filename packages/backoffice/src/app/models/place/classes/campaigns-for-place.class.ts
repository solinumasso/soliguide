import { PlaceUpdateCampaign } from "@soliguide/common";

export class CampaignsForPlace {
  public runningCampaign: PlaceUpdateCampaign;

  constructor(runningCampaign?: PlaceUpdateCampaign) {
    this.runningCampaign = new PlaceUpdateCampaign(runningCampaign);
  }
}
