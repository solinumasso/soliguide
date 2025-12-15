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
  ApiPlace,
  ApiTempInfoResponse,
  TempInfoType,
  BasePlaceTempInfo,
} from "@soliguide/common";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class AdminTempInfosService {
  public endPoint = `${environment.apiUrl}/temp-infos`;

  constructor(public http: HttpClient) {}

  public getTempInfos = (
    lieuId: number,
    tempInfoType: TempInfoType
  ): Observable<ApiTempInfoResponse> => {
    return this.http.get<ApiTempInfoResponse>(
      `${this.endPoint}/${tempInfoType}/${lieuId}`
    );
  };

  public patchTempInfo = (
    lieuId: number,
    tempInfo: BasePlaceTempInfo,
    tempInfoType: TempInfoType
  ): Observable<ApiTempInfoResponse> => {
    return this.http.patch<ApiTempInfoResponse>(
      `${this.endPoint}/${tempInfoType}/${lieuId}`,
      tempInfo
    );
  };

  public checkTempInfosInterval = (
    lieuId: number,
    infos: {
      _id: string | null;
      dateDebut: Date | null;
      dateFin: Date | null;
    },
    tempInfoType: TempInfoType
  ): Observable<boolean> => {
    return this.http.post<boolean>(
      `${this.endPoint}/check-date-interval/${lieuId}/${tempInfoType}`,
      infos
    );
  };

  public deleteOneTempInfo = (
    lieuId: number,
    tempInfoId: string,
    tempInfoType: TempInfoType
  ): Observable<ApiTempInfoResponse> => {
    return this.http.delete<ApiTempInfoResponse>(
      `${this.endPoint}/${tempInfoType}/${lieuId}/${tempInfoId}`
    );
  };

  // @deprecated
  public patchServicesClosed = (
    lieuId: number,
    services: BasePlaceTempInfo[]
  ): Observable<Place> => {
    return this.http
      .patch<ApiPlace>(`${this.endPoint}/services/${lieuId}`, services)
      .pipe(
        map((updatedPlace: ApiPlace) => {
          return new Place(updatedPlace, true);
        })
      );
  };
}
