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

import {
  SearchResults,
  SupportedLanguagesCode,
  TranslatedField,
  TranslatedPlace,
} from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { SearchTranslatedFields, SearchTranslatedPlace } from "../interfaces";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  public endPoint = `${environment.apiUrl}/translations`;
  constructor(private readonly http: HttpClient) {}

  public searchTranslatedFields(
    search: SearchTranslatedFields
  ): Observable<SearchResults<TranslatedField>> {
    return this.http
      .post<SearchResults<TranslatedField>>(`${this.endPoint}/search`, search)
      .pipe(
        map((response: SearchResults<TranslatedField>) => {
          if (!response.nbResults) {
            return { nbResults: 0, results: [] };
          }
          return response;
        })
      );
  }

  public searchTranslatedPlace(
    search: SearchTranslatedPlace
  ): Observable<SearchResults<TranslatedPlace>> {
    return this.http
      .post<SearchResults<TranslatedPlace>>(
        `${this.endPoint}/search-places`,
        search
      )
      .pipe(
        map((response: SearchResults<TranslatedPlace>) => {
          if (!response.nbResults) {
            return { nbResults: 0, results: [] };
          }
          return response;
        })
      );
  }

  public patchTranslatedField(
    tradFieldObjectId: string,
    formValue: { content: string; lang: SupportedLanguagesCode }
  ) {
    return this.http.patch<TranslatedField>(
      `${this.endPoint}/${tradFieldObjectId}`,
      formValue
    );
  }

  public findTranslatedField(
    tradFieldObjectId: string
  ): Observable<TranslatedField> {
    return this.http.get<TranslatedField>(
      `${this.endPoint}/${tradFieldObjectId}`
    );
  }

  public isTranslator(): Observable<boolean> {
    return this.http.get<boolean>(`${this.endPoint}/is-translator`);
  }
}
