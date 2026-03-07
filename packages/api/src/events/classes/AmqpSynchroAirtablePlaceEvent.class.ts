import {
  CAMPAIGN_DEFAULT_NAME,
  CampaignPlaceAutonomy,
  CampaignStatus,
  CommonNewPlaceService,
  getPosition,
  parsePhoneNumber,
  Phone,
  PlaceStatus,
  PlaceVisibility,
  SupportedLanguagesCode,
  type AnyDepartmentCode,
  type ApiPlace,
  type CommonPlaceSource,
  type CountryCodes,
  type PlaceType,
  type Themes,
} from "@soliguide/common";
import type { ModelWithId } from "../../_models";
import { AmqpEvent, SynchroAirtableEvent } from "../interfaces";
import { translateServiceName } from "../../autoexport/services/parsers";
import { isCampaignActive } from "../../campaign/controllers";

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
  }
}
