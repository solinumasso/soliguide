export class PlaceUpdateCampaignGeneralInformation {
  public changes: boolean; // Whether changes on the place have been reported through the form during the campaign
  public endDate: Date | null; // Date at which the form has been completed
  public startDate: Date | null; // Date at which the form started to be completed
  public updated: boolean; // Whether the place has been updated through the form during the campaign

  constructor(
    generalInformation?: Partial<PlaceUpdateCampaignGeneralInformation>
  ) {
    this.changes = generalInformation?.changes ?? false;
    this.endDate = generalInformation?.endDate
      ? new Date(generalInformation.endDate)
      : null;
    this.startDate = generalInformation?.startDate
      ? new Date(generalInformation.startDate)
      : null;
    this.updated = generalInformation?.updated ?? false;
  }
}
