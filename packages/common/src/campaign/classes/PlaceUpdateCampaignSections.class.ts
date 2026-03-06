import { PlaceUpdateCampaignSectionContent } from "./PlaceUpdateCampaignSectionContent.class";

export class PlaceUpdateCampaignSections {
  public hours: PlaceUpdateCampaignSectionContent;
  public services: PlaceUpdateCampaignSectionContent;
  public tempClosure: PlaceUpdateCampaignSectionContent;
  public tempMessage: PlaceUpdateCampaignSectionContent;

  constructor(sections?: Partial<PlaceUpdateCampaignSections>) {
    this.hours = new PlaceUpdateCampaignSectionContent(sections?.hours);
    this.services = new PlaceUpdateCampaignSectionContent(sections?.services);
    this.tempClosure = new PlaceUpdateCampaignSectionContent(
      sections?.tempClosure
    );
    this.tempMessage = new PlaceUpdateCampaignSectionContent(
      sections?.tempMessage
    );
  }
}
