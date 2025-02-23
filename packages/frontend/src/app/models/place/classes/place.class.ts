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
  ApiPlace,
  CommonPlaceParcours,
  Modalities,
  PlaceContact,
  CommonPlaceEntity,
  PlaceStatus,
  PlaceStepsDone,
  PlaceType,
  PlaceVisibility,
  Publics,
  CommonPlaceSource,
  CommonNewPlaceService,
  PlaceOpeningStatus,
  SupportedLanguagesCode,
  computePlaceOpeningStatus,
  SoliguideCountries,
} from "@soliguide/common";

import cloneDeep from "lodash.clonedeep";

import { PlaceTempInfos } from "./temp-infos/PlaceTempInfos.class";
import { CampaignsForPlace } from "./campaigns-for-place.class";
import { OpeningHours } from "./opening-hours.class";
import { Photo } from "./photo.class";
import { PlaceParcours } from "./place-parcours.class";
import { PlacePosition } from "./place-position.class";
import { Service } from "./service.class";

import { Organisation } from "../../../modules/admin-organisation/interfaces";
import { getUpdatedAtColor } from "../../../modules/admin-place/services/getUpdatedAtColor.service";
import { UpdatedAtColor } from "../../../modules/admin-place/types/UpdatedAtColor.type";

import { THEME_CONFIGURATION } from "../../themes";
import { PlaceSource } from "./place-sources.class";

export class Place implements Partial<ApiPlace> {
  public _id: string;
  public lieu_id: number;
  public seo_url: string;

  public auto: boolean;
  public name: string;
  public description: string;

  public descriptionExtract: string;

  public status: PlaceStatus;
  public isOpenToday: boolean;

  public visibility: PlaceVisibility;

  public photos: Photo[] = [];
  public organizations: Organisation[] = [];
  public placeType: PlaceType = PlaceType.PLACE;
  public services_all: Service[] = [];
  public position: PlacePosition;
  public parcours: PlaceParcours[];
  public entity: CommonPlaceEntity;

  public contacts?: PlaceContact[] = [];

  public newhours: OpeningHours;
  public modalities: Modalities;
  public publics: Publics;
  public languages: string[];
  public sourceLanguage: SupportedLanguagesCode;

  public createdAt: Date;
  public updatedAt: Date;
  public updatedByUserAt: Date;
  public updatedAtColor: UpdatedAtColor;
  public createdBy: string | null;

  public stepsDone: PlaceStepsDone;
  public tempInfos: PlaceTempInfos;
  public campaigns: CampaignsForPlace;
  public disabled: boolean; // Frontend variable only: used for definitively closed and drafts
  public priority?: boolean;
  public sources?: PlaceSource[];
  public country: SoliguideCountries;
  public openingTagStatus: PlaceOpeningStatus = PlaceOpeningStatus.UNKNOWN;

  // admin = variable indiquant qu'on est dans un formulaire
  public distance?: number;

  // 'isInForm' variable used if we're in the form only
  constructor(place?: ApiPlace, isInForm = false) {
    this._id = place?._id ?? "";

    this.placeType = place?.placeType ?? PlaceType.PLACE;

    // Automatically imported data
    this.auto = place?.auto ?? false;
    this.services_all = [];
    this.contacts = [];
    this.lieu_id =
      place && typeof place.lieu_id === "number" ? place.lieu_id : null;

    this.seo_url = place?.seo_url ?? null;
    this.priority = place?.priority ?? false;
    this.status = place?.status ?? PlaceStatus.DRAFT;
    this.visibility = place?.visibility ?? PlaceVisibility.ALL;
    this.isOpenToday = place?.isOpenToday ?? true;
    this.country = place?.country;

    this.name = place?.name ?? null;
    this.organizations = place?.organizations ?? [];
    this.description = (place?.description ?? "").replace(
      /<br>\\*/g,
      "</p><p>"
    );

    this.descriptionExtract = "";
    const textArea = document.createElement("textarea");

    textArea.innerHTML = this.description;
    this.descriptionExtract = textArea.value;
    this.descriptionExtract = String(this.descriptionExtract).replace(
      /<[^>]+>/gm,
      ""
    );

    this.createdAt = place?.createdAt ? new Date(place.createdAt) : null;

    this.createdBy = place?.createdBy ?? null;

    this.updatedByUserAt = place?.updatedByUserAt
      ? new Date(place.updatedByUserAt)
      : null;

    this.updatedAtColor = getUpdatedAtColor(this.updatedByUserAt);

    this.entity = place?.entity ?? {
      name: null,
      phones: [],
      mail: null,
      website: null,
      facebook: null,
      fax: null,
    };

    this.stepsDone = place?.stepsDone ?? {
      conditions: false,
      horaires: false,
      infos: false,
      photos: false,
      emplacement: false,
      publics: false,
      services: false,
      contacts: false,
    };

    this.photos = place?.photos
      ? place.photos.map((photo: Photo) => new Photo(photo))
      : [];

    this.position = new PlacePosition(place?.position ? place.position : null);

    this.campaigns = new CampaignsForPlace(
      place?.campaigns?.[`${CAMPAIGN_DEFAULT_NAME}`]
    );

    this.publics = new Publics(place?.publics ? place.publics : null);

    this.modalities = new Modalities(
      place?.modalities ? place.modalities : null
    );

    // Parcours de maraudes
    this.parcours = place?.parcours
      ? place.parcours.map(
          (parcours: CommonPlaceParcours) =>
            new PlaceParcours(parcours, isInForm)
        )
      : [];

    this.newhours = new OpeningHours(
      place?.newhours ? place.newhours : null,
      isInForm
    );

    this.tempInfos = new PlaceTempInfos(place?.tempInfos, isInForm);

    if (place?.services_all) {
      this.services_all = place.services_all.map(
        (service: CommonNewPlaceService) => new Service(service, isInForm)
      );

      // We create one service if we're in the form
      if (this.services_all.length === 0 && isInForm) {
        const firstService = new Service();

        firstService.hours = place?.newhours
          ? cloneDeep(this.newhours)
          : new OpeningHours(null, isInForm);

        firstService.modalities = place?.modalities
          ? cloneDeep(this.modalities)
          : new Modalities();

        firstService.publics = place?.publics
          ? cloneDeep(this.publics)
          : new Publics();

        this.services_all = [firstService];
      }

      this.languages = place?.languages?.length
        ? place.languages
        : [...THEME_CONFIGURATION.suggestedLanguages];

      if (place?.distance) {
        this.distance = place.distance;
      }

      this.sourceLanguage = place?.sourceLanguage;

      this.disabled =
        this.status === PlaceStatus.DRAFT ||
        this.status === PlaceStatus.PERMANENTLY_CLOSED;

      this.openingTagStatus = place
        ? computePlaceOpeningStatus(this)
        : PlaceOpeningStatus.UNKNOWN;

      if (place?.sources) {
        this.sources = place.sources.map(
          (source: CommonPlaceSource) => new PlaceSource(source)
        );
      } else {
        this.sources = [];
      }
    }
  }
}
