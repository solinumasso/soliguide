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
  CampaignSource,
  Modalities,
  PlaceChangesSection,
  PlaceChangesStatus,
  Publics,
  CommonPlaceChanges,
  CommonUserForLogs,
  CampaignName,
  CampaignChangesSection,
  AnyDepartmentCode,
  BasePlaceTempInfo,
  OpeningHours,
} from "@soliguide/common";

import { PlaceChangesTypeEdition } from "../enums";

import { Photo, Place, Service } from "../../place/classes";
import { CAMPAIGN_LIST } from "../../campaign";

export class PlaceChanges implements CommonPlaceChanges {
  public _id: string;
  public lieu_id: number;
  public source: CampaignSource | null;

  public typeOfEdition: PlaceChangesTypeEdition;

  public section: PlaceChangesSection | CampaignChangesSection;
  public old: Place | null;
  public new: Place | null;

  public userData: CommonUserForLogs;

  public userName: string;
  public noChanges: boolean;
  public status: PlaceChangesStatus | null;
  public createdAt: Date;
  public updatedAt: Date;

  public place: Pick<Place, "name"> | null;
  public isCampaign: boolean;
  public campaignName: CampaignName;
  public territory: AnyDepartmentCode | null;

  constructor(changes?: CommonPlaceChanges) {
    this._id = changes?._id ?? "";
    this.lieu_id = changes?.lieu_id ?? null;
    this.section = changes?.section ?? PlaceChangesSection.new;
    this.noChanges = changes?.noChanges ?? false;
    this.status = changes?.status ?? null;
    this.place = changes?.place ?? null;
    this.userData = changes?.userData ?? {
      email: null,
      orgaId: null,
      language: null,
      referrer: null,
      orgaName: null,
      role: null,
      status: null,
      territory: null,
      userName: null,
      user_id: null,
    };
    this.old = null;
    this.new = null;
    this.typeOfEdition = PlaceChangesTypeEdition.EDIT;
    this.isCampaign = changes?.isCampaign ?? false;
    this.campaignName = null;
    this.source = changes?.source ?? null;

    this.createdAt = changes?.createdAt ? new Date(changes.createdAt) : null;
    this.updatedAt = changes?.updatedAt ? new Date(changes.updatedAt) : null;

    if (!changes?.old && changes?.new) {
      this.typeOfEdition = PlaceChangesTypeEdition.CREATION;
    } else if (!changes?.old && !changes?.new) {
      this.typeOfEdition = PlaceChangesTypeEdition.DELETE;
    }

    if (changes) {
      this.userName = this.userData.userName ?? "ACCOUNT_DELETED";

      if (
        this.isCampaign &&
        Object.prototype.hasOwnProperty.call(
          CAMPAIGN_LIST,
          changes.campaignName
        )
      ) {
        this.campaignName = changes.campaignName;
      }

      this.setOldNewSection(changes);
    }
  }

  private setOldNewSection(changes?: CommonPlaceChanges): void {
    if (
      typeof changes.old !== "undefined" &&
      typeof changes.new !== "undefined"
    ) {
      this.old = new Place();
      this.new = new Place();
      switch (changes.section) {
        case PlaceChangesSection.tempClosure:
          this.old.tempInfos.closure = new BasePlaceTempInfo(changes.old);
          this.new.tempInfos.closure = new BasePlaceTempInfo(changes.new);
          break;

        case PlaceChangesSection.contacts:
          this.old.contacts = changes.old;
          this.new.contacts = changes.new;
          break;

        case PlaceChangesSection.hours:
          this.old.newhours = new OpeningHours(changes.old);
          this.new.newhours = new OpeningHours(changes.new);
          break;

        case PlaceChangesSection.modalities:
          this.old.modalities = new Modalities(changes.old);
          this.new.modalities = new Modalities(changes.new);
          break;

        case PlaceChangesSection.new:
          this.old = null;
          this.new = new Place(changes.new);
          break;

        case PlaceChangesSection.public:
          this.old.publics = new Publics(changes.old.publics);
          this.old.languages = changes.old.languages;
          this.new.publics = new Publics(changes.new.publics);
          this.new.languages = changes.new.languages;
          break;

        case PlaceChangesSection.photos:
          this.old.photos = changes.old.map((photo: Photo) => new Photo(photo));
          this.new.photos = changes.new.map((photo: Photo) => new Photo(photo));
          break;

        case PlaceChangesSection.services:
          if (changes.old && changes.new) {
            this.old.services_all = changes.old.map((service: Service) => {
              return new Service(service);
            });
            this.new.services_all = changes.new.map((service: Service) => {
              return new Service(service);
            });
          }
          break;

        case PlaceChangesSection.status:
          this.old.status = changes.old;
          this.new.status = changes.new;
          break;

        case PlaceChangesSection.visibility:
          this.old.visibility = changes.old;
          this.new.visibility = changes.new;
          break;

        case PlaceChangesSection.tempHours:
          this.old.tempInfos.hours = new BasePlaceTempInfo(changes.old);
          this.new.tempInfos.hours = new BasePlaceTempInfo(changes.new);
          break;

        case PlaceChangesSection.tempMessage:
          this.old.tempInfos.message = new BasePlaceTempInfo(changes.old);
          this.new.tempInfos.message = new BasePlaceTempInfo(changes.new);
          break;

        default:
          // generalinfo et emplacement
          this.old = new Place(changes.old);
          this.new = new Place(changes.new);
          break;
      }
    }
  }
}
