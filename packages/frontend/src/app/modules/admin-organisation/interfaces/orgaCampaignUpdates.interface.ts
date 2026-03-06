import { OrgaCampaignStatus } from "../../../models";

export class OrgaCampaignUpdates {
  public autonomyRate: number;
  public endDate: Date;
  public startDate: Date;
  public status: OrgaCampaignStatus;
  public toUpdate: boolean;

  constructor(orgaCampaignUpdates?: Partial<OrgaCampaignUpdates>) {
    this.autonomyRate = orgaCampaignUpdates?.autonomyRate ?? 0;
    this.endDate = orgaCampaignUpdates?.endDate
      ? new Date(orgaCampaignUpdates.endDate)
      : null;
    this.startDate = orgaCampaignUpdates?.startDate
      ? new Date(orgaCampaignUpdates.startDate)
      : null;
    this.status = orgaCampaignUpdates?.status ?? OrgaCampaignStatus.TO_DO;
    this.toUpdate = orgaCampaignUpdates?.toUpdate ?? false;
  }
}
