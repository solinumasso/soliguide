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
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import type { Observable } from "rxjs";
import { map } from "rxjs/operators";

import type {
  ApiPlace,
  CampaignSource,
  Modalities,
  PlaceContactForAdmin,
  PlaceStatus,
  PlaceVisibility,
} from "@soliguide/common";

import { environment } from "../../../../environments/environment";
import {
  type OpeningHours,
  Place,
  type PlaceParcours,
  type PlacePosition,
  type Service,
  THEME_CONFIGURATION,
} from "../../../models";
import { CurrentLanguageService } from "../../general/services/current-language.service";

@Injectable({
  providedIn: "root",
})
export class AdminPlaceService {
  public endPoint = `${environment.apiUrl}admin/places/`;

  constructor(
    private readonly http: HttpClient,
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public create = (
    place: Place,
    orgaObjectId: string | null
  ): Observable<Place> => {
    const postUrl = orgaObjectId
      ? `${this.endPoint}infos/${orgaObjectId}`
      : `${this.endPoint}infos`;

    const payload = {
      ...place,
      country: THEME_CONFIGURATION.country,
    };

    const response =
      place.lieu_id !== null
        ? this.http.patch<ApiPlace>(
            `${this.endPoint}infos/${place.lieu_id}`,
            place
          )
        : this.http.post<ApiPlace>(postUrl, payload);

    return response.pipe(
      map((updatedPlace: ApiPlace) => new Place(updatedPlace, true))
    );
  };

  public getPlace = (
    lieu_id: string | number,
    isInForm = false
  ): Observable<Place> => {
    return this.http
      .get<ApiPlace>(
        `${this.endPoint}${lieu_id}/${this.currentLanguageService.currentLanguage}`
      )
      .pipe(map((place: ApiPlace) => new Place(place, isInForm)));
  };

  public checkDuplicates = (
    lieu_id: number,
    position: PlacePosition
  ): Observable<Place[]> => {
    return this.http
      .post<ApiPlace[]>(`${this.endPoint}check-duplicates/${lieu_id} `, {
        postalCode: position.postalCode,
        address: position.address,
      })
      .pipe(
        map((places: ApiPlace[]) => {
          return Array.isArray(places)
            ? places.map((item) => new Place(item))
            : [];
        })
      );
  };

  public checkInOrga = (lieu_id: number): Observable<boolean> => {
    return this.http.get<boolean>(`${this.endPoint}check-in-orga/${lieu_id}`);
  };

  public patchPhotos = (place: Place): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}photos/${place.lieu_id}`, place.photos)
      .pipe(
        map((updatedPlace: ApiPlace) => {
          return new Place(updatedPlace, true);
        })
      );
  };

  public patchPlaceContacts = (
    lieu_id: number,
    newPlaceContacts: PlaceContactForAdmin[],
    oldPlaceContacts: PlaceContactForAdmin[],
    cguChecked: boolean
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}contacts/${lieu_id}`, {
        newPlaceContacts,
        oldPlaceContacts,
        cguChecked,
      })
      .pipe(
        map((updatedPlace: ApiPlace) => {
          return new Place(updatedPlace, true);
        })
      );
  };

  public patchPublics = (
    place: Place,
    isCampaign = false
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}publics/${place.lieu_id}`, {
        isCampaign,
        publics: place.publics,
        languages: place.languages,
      })
      .pipe(
        map((updatedPlace: ApiPlace) => {
          return new Place(updatedPlace, true);
        })
      );
  };

  public patchPosition = (
    lieuId: number,
    position: PlacePosition
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}position/${lieuId}`, {
        ...position,
      })
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public patchParcours = (
    lieuId: number,
    parcours: PlaceParcours[]
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}parcours/${lieuId}`, {
        ...parcours,
      })
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public patchStatus = (
    place: Place,
    status: PlaceStatus
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}status/${place.lieu_id}`, { status })
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public patchVisibility = (
    place: Place,
    visibility: PlaceVisibility
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}visibility/${place.lieu_id}`, {
        visibility,
      })
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public patchHoraires = (
    lieuId: number,
    updatedHours: OpeningHours
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}hours/${lieuId}`, {
        newhours: updatedHours,
      })
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public patchServices = (
    lieuId: number,
    services: Service[]
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}services/${lieuId}`, {
        services_all: services,
      })
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public patchModalities = (
    lieu_id: number,
    modalities: Modalities
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}modalities/${lieu_id}`, { modalities })
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public patchNoChange = (lieuId: number): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}no-change/${lieuId}`, {})
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public patchCampaignSource = (
    lieu_id: number,
    source: CampaignSource
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}campaign-source/${lieu_id}`, { source })
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };

  public duplicatePlace = (lieuId: number): Observable<Place> => {
    return this.http
      .post<ApiPlace>(`${this.endPoint}duplicate/${lieuId}`, {})
      .pipe(map((updatedPlace: ApiPlace) => new Place(updatedPlace, true)));
  };
}
