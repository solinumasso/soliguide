/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  CampaignChangesSection,
  CampaignName,
  CampaignSource,
} from "../../campaign";
import { AnyDepartmentCode, SoliguideCountries } from "../../location";
import { PlaceChangesSection, PlaceChangesStatus } from "../enums";
import { CommonUserForLogs } from "./CommonUserForLogs.interface";

export interface CommonPlaceChanges {
  _id?: string;
  lieu_id: number;
  source: CampaignSource | null;
  section: PlaceChangesSection | CampaignChangesSection;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  old: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new: any | null;
  userData: CommonUserForLogs;
  userName: string;
  noChanges: boolean;
  status: PlaceChangesStatus | null;
  createdAt: Date;
  updatedAt: Date;
  isCampaign: boolean;
  country?: SoliguideCountries;
  territory: AnyDepartmentCode | null;
  campaignName: CampaignName | null;
  place?: any;
}
