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

import { CommonPlaceSource } from "@soliguide/common";

import { environment } from "../../../../environments/environment";
import { ApiMessage } from "../../../models";

@Injectable({
  providedIn: "root",
})
export class SoligarePairService {
  constructor(private http: HttpClient) {}

  public sourceDetails(sourceId: string): Observable<CommonPlaceSource> {
    const url = `${environment.apiUrl}/v2/soligare/source/details/${sourceId}`;
    return this.http.get<CommonPlaceSource>(`${url}`);
  }

  public putSource(
    soliguideId: number,
    body: CommonPlaceSource
  ): Observable<ApiMessage> {
    const url = `${environment.apiUrl}/admin/places/sources/${soliguideId}`;

    const details = {
      source: {
        id: body.ids[0].id,
        url: body.ids[0].url,
        name: body.name,
        license: body.license,
        isOrigin: body.isOrigin,
      },
    };

    return this.http.put<ApiMessage>(`${url}`, details);
  }

  public pair(sourceId: string, soliguideId: number): Observable<ApiMessage> {
    const url = `${environment.apiUrl}/v2/soligare/pairing/pair`;
    const body = {
      source_id: sourceId,
      soliguide_id: soliguideId,
    };
    return this.http.post<ApiMessage>(`${url}`, body);
  }
}
