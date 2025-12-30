/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
      .map((service: CommonNewPlaceService) =>
        service.category
          ? translateServiceName(service.category, SupportedLanguagesCode.FR)
          : ""
      )
      .filter((categoryName: string) => categoryName);
    this.status = isDeleted ? "DELETED" : (place.status as PlaceStatus);
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
