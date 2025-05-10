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

import { ApiSearchResults } from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Search } from "../interfaces";

import { CurrentLanguageService } from "../../general/services/current-language.service";

import { Place, SearchResults } from "../../../models";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  public ep = `${environment.apiUrl}new-search/`;

  constructor(
    private readonly http: HttpClient,
    private readonly currentLanguageService: CurrentLanguageService
  ) {}

  public launchSearch(search: Search): Observable<SearchResults> {
    const url = this.ep + this.currentLanguageService.currentLanguage;

    return this.http.post<ApiSearchResults>(`${url}`, search).pipe(
      map((response: ApiSearchResults) => {
        const result: SearchResults = {
          nbResults: 0,
          places: [],
        };

        if (!response.nbResults) {
          return result;
        }

        if (response.nbResults > 0) {
          result.nbResults = response.nbResults;
          result.places = response.places.map((item) => new Place(item, false));
        }
        return result;
      })
    );
  }
}
