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
import { Injectable } from "@angular/core";
import { BehaviorSubject, type Observable, of, retry, tap } from "rxjs";

import {
  GeoPosition,
  type LocationAutoCompleteAddress,
} from "@soliguide/common";

import { LOGOS_TERRITORIES } from "../../../shared/constants";
import { Logos } from "../../../shared/types";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { globalConstants } from "../../../shared/functions";
import { THEME_CONFIGURATION } from "../../../models";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  // Location
  public readonly localPositionSubject: BehaviorSubject<GeoPosition | null>;

  // Logos
  public readonly logosToDisplaySubject: BehaviorSubject<Logos[]>;

  private readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly locationAutocompleteEndpoint = `${environment.locationApiUrl}/autocomplete/${this.THEME_CONFIGURATION.country}/`;
  private readonly locationReverseEndpoint = `${environment.locationApiUrl}/reverse/${this.THEME_CONFIGURATION.country}/`;

  public lastQuery = "";
  public lastSearchResults: LocationAutoCompleteAddress[];

  constructor(private readonly http: HttpClient) {
    const geoPosition = globalConstants.getItem("SOLIGUIDE_POSITION");
    this.logosToDisplaySubject = new BehaviorSubject<Logos[]>([]);

    this.localPositionSubject = new BehaviorSubject<GeoPosition>(
      new GeoPosition(geoPosition)
    );

    this.localPositionSubject.subscribe((localPosition: GeoPosition) => {
      globalConstants.setItem("SOLIGUIDE_POSITION", localPosition);

      const territoryCode = localPosition?.departmentCode;
      if (territoryCode) {
        this.logosToDisplaySubject.next(
          typeof LOGOS_TERRITORIES[territoryCode] !== "undefined"
            ? LOGOS_TERRITORIES[territoryCode]
            : []
        );
      }
    });
  }

  public get localPositionValue(): GeoPosition | null {
    return this.localPositionSubject.value;
  }

  public locationAutoComplete(
    term: string,
    addressesOnly = false
  ): Observable<LocationAutoCompleteAddress[]> {
    if (this.lastQuery === term) {
      return of(this.lastSearchResults);
    }

    const endpoint = addressesOnly ? "address" : "all";

    let url = `${this.locationAutocompleteEndpoint}${endpoint}/${encodeURI(
      term.trim()
    )}`;

    const position = this.localPositionSubject.getValue();

    if (position?.coordinates.length) {
      url = `${url}?latitude=${position.coordinates[1]}&longitude=${position.coordinates[0]}`;
    }

    return this.http.get<LocationAutoCompleteAddress[]>(url).pipe(
      retry(1),
      tap((results: LocationAutoCompleteAddress[]) => {
        this.lastQuery = term;
        this.lastSearchResults = results;
      })
    );
  }

  public reverse(
    latitude: number,
    longitude: number
  ): Observable<LocationAutoCompleteAddress[]> {
    return this.http
      .get<LocationAutoCompleteAddress[]>(
        `${this.locationReverseEndpoint}${latitude}/${longitude}`
      )
      .pipe(retry(2));
  }
}
