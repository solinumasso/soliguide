import { CampaignPlaceAutonomy, CampaignStatus } from "@soliguide/common";

export interface CampaignUpdates {
  autonomy?: CampaignPlaceAutonomy;

  currentStep?: 0 | 1 | 2 | 3;

  general?: {
    changes: boolean;
    endDate: Date | null;
    startDate: Date | null;
    updated: boolean;
  };

  remindMeDate?: Date | null;

  sections?: {
    tempClosure?: {
      changes: boolean;
      date: Date | null;
      updated: boolean;
    };
    hours?: {
      changes: boolean;
      date: Date | null;
      updated: boolean;
    };
    services?: {
      changes: boolean;
      date: Date | null;
      updated: boolean;
    };
    tempMessage?: {
      changes: boolean;
      date: Date | null;
      updated: boolean;
    };
  };

  status?: CampaignStatus;

  toUpdate?: boolean;
}
