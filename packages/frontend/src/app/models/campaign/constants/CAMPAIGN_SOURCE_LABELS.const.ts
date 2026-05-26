import { CampaignSource } from "@soliguide/common";

export const CAMPAIGN_SOURCE_LABELS: Record<CampaignSource, string> = {
  CALL: "CALL",
  EMAIL: "EMAIL",
  EMAILS_AUTOMATIQUES: "EMAILS_AUTOMATIQUES",
  CHAT: "CHAT",
  CONTACT: "CONTACT",
  VISIT: "VISIT",
  COORDINATION: "COORDINATION",
  INTERNET: "INTERNET",
};

// Sources selectable manually by admins — excludes automatic sources
export const CAMPAIGN_SOURCE_MANUAL_LABELS: Partial<
  Record<CampaignSource, string>
> = {
  CALL: "CALL",
  EMAIL: "EMAIL",
  CHAT: "CHAT",
  CONTACT: "CONTACT",
  VISIT: "VISIT",
  COORDINATION: "COORDINATION",
  INTERNET: "INTERNET",
};
