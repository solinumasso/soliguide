import { CampaignIcon } from "../types";
import { CampaignIconName } from "@soliguide/common";

export const CAMPAIGN_ICONS: {
  [key in CampaignIconName]: CampaignIcon;
} = {
  snow: "❄️",
  sun: "☀️",
  covid: "🦠",
  ukraine: "🇺🇦",
};
