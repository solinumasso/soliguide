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
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { ApiPlace, ExternalStructure, SearchResults } from "@soliguide/common";

import { environment } from "../../../../environments/environment";
import { Place } from "../../../models/place";
import { SearchPairing } from "../classes";

@Injectable({
  providedIn: "root",
})
export class SoligareSearchService {
  constructor(private readonly http: HttpClient) {}

  public launchSearch(
    search: SearchPairing
  ): Observable<SearchResults<ExternalStructure>> {
    const url = `${environment.apiUrl}/v2/soligare/pairing/to-pair`;
    return this.http.post<SearchResults<ExternalStructure>>(`${url}`, {
      sources: search.sources ?? [],
      territories: search.territories ?? [],
      options: search.options ?? { limit: 10, page: 1 },
    });
  }

  public getDuplicates(place: Partial<ApiPlace>): Observable<Place[]> {
    const url = `${environment.apiUrl}/integration/search-duplicates`;
    return this.http.post<Place[]>(url, place);
  }

  public getExternalStructure(id: string): Observable<Partial<ApiPlace>> {
    const url = `${environment.apiUrl}/v2/soligare/pairing/external-structure/${id}`;

    return this.http.get<Partial<ApiPlace>>(url);
  }
}
