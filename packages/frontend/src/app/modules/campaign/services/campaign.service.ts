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

import { ApiPlace } from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { CampaignFormSection } from "../../../models/campaign/types";
import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CampaignService {
  public endPoint = `${environment.apiUrl}/campaign`;

  constructor(private readonly http: HttpClient) {}

  public getPlacesForCampaign = (orgaId?: number): Observable<Place[]> => {
    let url = `${this.endPoint}/places/`;
    url = orgaId >= 0 ? url + orgaId : url;

    return this.http.get<ApiPlace[]>(url).pipe(
      map((places: ApiPlace[]) => {
        return Array.isArray(places)
          ? places.map((item) => new Place(item))
          : [new Place(places)];
      })
    );
  };

  public setNoChangeForSection = (
    lieu_id: number,
    section: CampaignFormSection
  ): Observable<Place> => {
    return this.http
      .get<ApiPlace>(`${this.endPoint}/no-change/${lieu_id}/${section}`)
      .pipe(
        map((place: ApiPlace) => {
          return new Place(place, true);
        })
      );
  };

  public setNoChangeForPlace = (lieu_id: number): Observable<Place> => {
    return this.http
      .get<ApiPlace>(`${this.endPoint}/no-change/${lieu_id}/place`)
      .pipe(
        map((place: ApiPlace) => {
          return new Place(place, false);
        })
      );
  };

  public setRemindMeLater = (
    lieu_id: number,
    date: Date
  ): Observable<Place> => {
    return this.http
      .post<ApiPlace>(`${this.endPoint}/remind-me/${lieu_id}`, { date })
      .pipe(
        map((place: ApiPlace) => {
          return new Place(place, false);
        })
      );
  };

  public getIfCampaignAccessible = (
    typeCheck: string,
    user_id: number
  ): Observable<boolean> => {
    return this.http.get<boolean>(
      `${this.endPoint}/isCampaignOnTerritory/${typeCheck}/${user_id}`
    );
  };
}
