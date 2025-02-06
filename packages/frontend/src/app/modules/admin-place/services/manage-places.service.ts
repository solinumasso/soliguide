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

import { ApiPlace, ApiSearchResults, ExportParams } from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { AdminSearchPlaces } from "../classes";

import { ApiMessage } from "../../../models/api";
import { Place } from "../../../models/place/classes";
import { SearchResults } from "../../../models/search-places";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ManagePlacesService {
  constructor(private readonly http: HttpClient) {}

  public autoExport(
    search: AdminSearchPlaces,
    exportParams: ExportParams
  ): Observable<Blob> {
    return this.http.post(
      `${environment.apiUrl}autoexport`,
      { ...search, exportParams },
      {
        responseType: "blob",
      }
    );
  }

  public getPlaceForAdmin(lieu_id: string): Observable<Place> {
    return this.http
      .get<ApiPlace>(`${environment.apiUrl}admin/places/${lieu_id}`)
      .pipe(
        map((place: ApiPlace) => {
          return new Place(place, false);
        })
      );
  }

  public launchSearch(
    search: AdminSearchPlaces,
    context: "admin-search" | "admin-search-to-add-place-in-orga"
  ): Observable<SearchResults> {
    return this.http
      .post<ApiSearchResults>(
        `${environment.apiUrl}new-search/${context}`,
        search
      )
      .pipe(
        map((response: ApiSearchResults) => {
          const result: SearchResults = {
            nbResults: 0,
            places: [],
          };
          if (response.nbResults > 0) {
            result.nbResults = response.nbResults;
            result.places = response.places.map(
              (item) => new Place(item, false)
            );
          }

          return result;
        })
      );
  }

  public deletePlace(lieu_id: number): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(
      `${environment.apiUrl}admin/places/${lieu_id}`
    );
  }

  public deletePair(lieu_id: number): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(
      `${environment.apiUrl}v2/soligare/pairing/pair/${lieu_id}`
    );
  }
}
