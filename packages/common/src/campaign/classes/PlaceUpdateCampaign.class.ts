import { PlaceUpdateCampaignGeneralInformation } from "./PlaceUpdateCampaignGeneralInformation.class";
import { PlaceUpdateCampaignSections } from "./PlaceUpdateCampaignSections.class";

import {
  CampaignPlaceAutonomy,
  CampaignSource,
  CampaignStatus,
} from "../enums";

export class PlaceUpdateCampaign {
  public autonomy: CampaignPlaceAutonomy;
  public currentStep: number;
  public general: PlaceUpdateCampaignGeneralInformation;
  public remindMeDate: Date | null;
  public sections: PlaceUpdateCampaignSections;
  public source: CampaignSource | null;
  public status: CampaignStatus;
  public toUpdate: boolean;

  constructor(placeUpdateCampaign?: Partial<PlaceUpdateCampaign>) {
    this.autonomy =
      placeUpdateCampaign?.autonomy ?? CampaignPlaceAutonomy.UNKNOWN;
    this.currentStep = placeUpdateCampaign?.currentStep ?? 0;
    this.general = new PlaceUpdateCampaignGeneralInformation(
      placeUpdateCampaign?.general
    );
    this.remindMeDate = placeUpdateCampaign?.remindMeDate
      ? new Date(placeUpdateCampaign.remindMeDate)
      : null;
    this.sections = new PlaceUpdateCampaignSections(
      placeUpdateCampaign?.sections
    );
    this.source = placeUpdateCampaign?.source ?? null;
    this.status = placeUpdateCampaign?.status ?? CampaignStatus.TO_DO;
    this.toUpdate = placeUpdateCampaign?.toUpdate ?? false;
  }
}
