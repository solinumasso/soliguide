export class PlaceUpdateCampaignSectionContent {
  public changes: boolean;
  public date: Date | null;
  public updated: boolean;

  constructor(content?: Partial<PlaceUpdateCampaignSectionContent>) {
    this.changes = content?.changes ?? false;
    this.date = content?.date ? new Date(content.date) : null;
    this.updated = content?.updated ?? false;
  }
}
