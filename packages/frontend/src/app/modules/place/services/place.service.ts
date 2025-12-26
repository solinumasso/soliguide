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

import { CurrentLanguageService } from "../../general/services/current-language.service";

import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PlaceService {
  constructor(
    private readonly http: HttpClient,
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public getPlace = (seoUrl: string): Observable<Place> => {
    const apiURL = `${environment.apiUrl}/place/${seoUrl}/${this.currentLanguageService.currentLanguage}`;

    return this.http
      .get<ApiPlace>(apiURL)
      .pipe(map((place: ApiPlace) => new Place(place, false)));
  };

  // Structures modification button
  public canEditPlace = (seoUrl: string): Observable<boolean> => {
    return this.http.get<boolean>(
      `${environment.apiUrl}/admin/user-rights/can-edit/${seoUrl}`
    );
  };

  public canReadChangePlace = (changeObjectId: string): Observable<boolean> => {
    return this.http.get<boolean>(
      `${environment.apiUrl}/place-changes/can-read-change/${changeObjectId}`
    );
  };
}
