import {
  CAMPAIGN_DEFAULT_NAME,
  CampaignName,
  CampaignPlaceAutonomy,
  CampaignStatus,
  CommonNewPlaceService,
  getPosition,
  parsePhoneNumber,
  Phone,
  PlaceStatus,
  PlaceVisibility,
  SupportedLanguagesCode,
  Themes,
  TempInfoType,
  type AnyDepartmentCode,
  type ApiPlace,
  type CommonPlaceSource,
  type CountryCodes,
  type PlaceType,
} from "@soliguide/common";
import type { ModelWithId } from "../../_models";
import { AmqpEvent, SynchroAirtableEvent } from "../interfaces";
import { translateServiceName } from "../../autoexport/services/parsers";
import { parseHours } from "../../autoexport/services/parsers/parse-hours.parser";
import { parseTempInfo } from "../../autoexport/services/parsers/parse-temp-info";
import { isCampaignActive } from "../../campaign/controllers";
import { translator } from "../../config";
import { FRONT_URLS_MAPPINGS } from "../../_models/config/constants/domains/THEMES_MAPPING.const";

function getLangFromTheme(theme: Themes | null): string {
  if (!theme) return SupportedLanguagesCode.FR;

  const url = FRONT_URLS_MAPPINGS[theme] ?? "";

  if (url.includes("soliguia.es")) {
    return SupportedLanguagesCode.ES;
  }
  if (url.includes("soliguia.ad") || url.includes("soliguia.cat")) {
    return SupportedLanguagesCode.CA;
  }
  return SupportedLanguagesCode.FR;
}

export class AmqpSynchroAirtablePlaceEvent
  implements AmqpEvent, SynchroAirtableEvent
{
  public frontendUrl: string;
  public theme: Themes | null;

  public entityType: "PLACE";

  public name: string;
  public organization: { name: string; organization_id: number }[];
  public postalCode?: string;
  public placeId: number;
  public placeType: PlaceType;
  public services: string[];
  public status: PlaceStatus | "DELETED";
  public territory?: AnyDepartmentCode;
  public country?: CountryCodes;
  public city?: string;
  public address?: string;
  public visibility: PlaceVisibility;
  public toUpdate: boolean;
  public sources: CommonPlaceSource[];
  public website: string;
  public email: string;
  public phones: string;
  public isOpenToday: boolean;
  public autonomy?: CampaignPlaceAutonomy;
  public remindMeDate?: Date;
  public campaignStatus?: CampaignStatus;

  // Brevo-specific fields
  public schedules: string;
  public temporarySchedules: string;
  public updateCampaignLink: string;
  public publicSiteLink: string;
  public updateCampaignMidYear: boolean;
  public updateCampaignEndYear: boolean;
  public allPlacesLink: string;

  constructor(
    place: ModelWithId<ApiPlace>,
    frontendUrl: string,
    theme: Themes | null,
    isDeleted = false
  ) {
    this.frontendUrl = frontendUrl;
    this.theme = theme;
    this.entityType = "PLACE";

    const position = getPosition(place);
    this.territory = position?.departmentCode;
    this.country = position?.country;
    this.city = position?.city;
    this.address = position?.address;
    this.postalCode = position?.postalCode;

    this.name = place.name;
    this.organization = place.organizations;
    this.placeId = place.lieu_id;
    this.placeType = place.placeType;
    this.services = place.services_all
      ? place.services_all
          .map((service: CommonNewPlaceService) =>
            service.category
              ? translateServiceName(
                  service.category,
                  SupportedLanguagesCode.FR
                )
              : ""
          )
          .filter((categoryName: string) => categoryName)
      : [];
    this.status = isDeleted ? "DELETED" : (place.status as PlaceStatus);
    this.isOpenToday = place.isOpenToday ?? false;
    this.visibility = place.visibility;
    this.sources = place.sources ?? [];
    this.website = place.entity?.website || "";
    this.email = place.entity?.mail || "";

    if (place.entity.phones.length > 0 && place.entity.phones[0]?.phoneNumber) {
      this.phones = place.entity.phones
        .map((phone: Phone) =>
          parsePhoneNumber(phone, phone.countryCode as CountryCodes)
        )
        .filter(Boolean)
        .join("\n");
    } else {
      this.phones = "";
    }

    if (
      this.territory &&
      isCampaignActive([this.territory]) &&
      place.campaigns[CAMPAIGN_DEFAULT_NAME]
    ) {
      this.toUpdate = place.campaigns[CAMPAIGN_DEFAULT_NAME].toUpdate;

      if (place.campaigns[CAMPAIGN_DEFAULT_NAME].toUpdate) {
        if (place.campaigns[CAMPAIGN_DEFAULT_NAME].autonomy) {
          this.autonomy = place.campaigns[CAMPAIGN_DEFAULT_NAME].autonomy;
        }

        if (place.campaigns[CAMPAIGN_DEFAULT_NAME].remindMeDate) {
          this.remindMeDate =
            place.campaigns[CAMPAIGN_DEFAULT_NAME].remindMeDate;
        }

        if (place.campaigns[CAMPAIGN_DEFAULT_NAME].status) {
          this.campaignStatus = place.campaigns[CAMPAIGN_DEFAULT_NAME].status;
        }
      }
    }

    // Brevo-specific fields

    // Regular schedules formatted as human-readable string
    this.schedules = place.newhours
      ? parseHours(place.newhours, SupportedLanguagesCode.FR, false, true, true)
      : "";

    // Temporary schedules (hours and closures) formatted as human-readable string
    const tempInfoItems: Parameters<typeof parseTempInfo>[2] = [];

    if (place.tempInfos?.hours?.actif) {
      tempInfoItems.push({
        tempInfoType: TempInfoType.HOURS,
        dateDebut: place.tempInfos.hours.dateDebut ?? undefined,
        dateFin: place.tempInfos.hours.dateFin ?? undefined,
        name: place.tempInfos.hours.name ?? undefined,
        description: place.tempInfos.hours.description ?? undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hours: (place.tempInfos.hours.hours ?? undefined) as any,
      });
    }

    if (place.tempInfos?.closure?.actif) {
      tempInfoItems.push({
        tempInfoType: TempInfoType.CLOSURE,
        dateDebut: place.tempInfos.closure.dateDebut ?? undefined,
        dateFin: place.tempInfos.closure.dateFin ?? undefined,
        name: place.tempInfos.closure.name ?? undefined,
        description: place.tempInfos.closure.description ?? undefined,
      });
    }

    const tempHoursString = tempInfoItems.some(
      (t) => t.tempInfoType === TempInfoType.HOURS
    )
      ? parseTempInfo(
          translator,
          SupportedLanguagesCode.FR,
          tempInfoItems.filter((t) => t.tempInfoType === TempInfoType.HOURS),
          TempInfoType.HOURS,
          true
        )
      : "";

    const tempClosureString = tempInfoItems.some(
      (t) => t.tempInfoType === TempInfoType.CLOSURE
    )
      ? parseTempInfo(
          translator,
          SupportedLanguagesCode.FR,
          tempInfoItems.filter((t) => t.tempInfoType === TempInfoType.CLOSURE),
          TempInfoType.CLOSURE,
          true
        )
      : "";

    this.temporarySchedules = [tempHoursString, tempClosureString]
      .filter(Boolean)
      .join("\n\n");

    const lang = getLangFromTheme(theme);

    this.updateCampaignLink = `${frontendUrl}${lang}/campaign/fiche/${place.lieu_id}`;

    this.publicSiteLink = `${frontendUrl}${lang}/fiche/${place.lieu_id}`;

    const firstOrg = place.organizations?.[0];
    this.allPlacesLink = firstOrg?.organization_id
      ? `${frontendUrl}${lang}/organisations/${firstOrg.organization_id}`
      : "";

    // Campaign booleans: whether the place reported changes during each campaign period
    this.updateCampaignMidYear =
      place.campaigns?.[CampaignName.MID_YEAR_2025]?.general?.changes ?? false;
    this.updateCampaignEndYear =
      place.campaigns?.[CampaignName.END_YEAR_2025]?.general?.changes ?? false;
  }
}
