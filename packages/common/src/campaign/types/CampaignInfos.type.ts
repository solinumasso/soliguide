import { AnyDepartmentCode } from "../../location/types";
import { CampaignIconName } from "./CampaignIconName.type";
import { CampaignChangesSection } from "../enums/CampaignChangesSection.enum";
import { KeyStringValueAny } from "../../general/types";

export interface CampaignInfos {
  adjective?: string;
  closingFormula?: string;
  dateDebutAffichage: Date;
  dateDebutCampagne: Date;
  dateFin: Date;
  description: string;
  icon?: CampaignIconName; // Emoji to display
  period?: string;
  name: string;
  specificServiceMessage?: string;
  placesToUpdate: KeyStringValueAny | null;
  sections?: CampaignChangesSection[];
  territories: AnyDepartmentCode[];
}
