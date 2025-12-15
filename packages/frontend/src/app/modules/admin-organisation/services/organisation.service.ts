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

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Organisation, SearchOrgaObject } from "../interfaces";
import { Place } from "../../../models/place/classes";

import { environment } from "../../../../environments/environment";
import { ApiMessage } from "../../../models";
import {
  ApiOrganization,
  SearchResults,
  UserRightEditionPayload,
  UserRightsForOrganizations,
} from "@soliguide/common";

@Injectable({
  providedIn: "root",
})
export class OrganisationService {
  private endPoint = `${environment.apiUrl}/organizations`;
  private endPointRoles = `${environment.apiUrl}/admin/user-rights`;

  constructor(private http: HttpClient) {}

  public create(
    orgaObjectId: string,
    organisation: Organisation
  ): Observable<Organisation> {
    const response = orgaObjectId
      ? this.http.patch(`${this.endPoint}/${orgaObjectId}`, organisation)
      : this.http.post(`${this.endPoint}`, organisation);

    return response.pipe(
      map((updatedOrganization) => {
        return new Organisation(updatedOrganization, true);
      })
    );
  }

  public get(organization_id: string): Observable<Organisation> {
    return this.http.get(`${this.endPoint}/${organization_id}`).pipe(
      map((organisation) => {
        return new Organisation(organisation, true);
      })
    );
  }

  public getRolesForOrga(
    orga: Organisation
  ): Observable<UserRightsForOrganizations[]> {
    return this.http.get<UserRightsForOrganizations[]>(
      `${this.endPointRoles}/${orga._id}`
    );
  }

  public removeUserFromOrga(
    userObjectId: string,
    orgaObjectId: string
  ): Observable<Organisation> {
    return this.http
      .delete(`${this.endPoint}/${orgaObjectId}/user/${userObjectId}`)
      .pipe(
        map((organisation) => {
          return new Organisation(organisation, true);
        })
      );
  }

  public searchOrga(
    search: SearchOrgaObject
  ): Observable<SearchResults<Organisation>> {
    return this.http
      .post<SearchResults<ApiOrganization>>(`${this.endPoint}/search`, search)
      .pipe(
        map((response: SearchResults<ApiOrganization>) => {
          const searchResults: SearchResults<Organisation> = {
            nbResults: 0,
            results: [],
          };
          if (!response.nbResults) {
            return searchResults;
          }

          if (response.nbResults > 0) {
            searchResults.results = Array.isArray(response.results)
              ? response.results.map((item) => new Organisation(item))
              : [new Organisation(response.results)];
            searchResults.nbResults = response.nbResults;
          }
          return searchResults;
        })
      );
  }

  public addPlaceToOrga(
    orga: Organisation,
    place: Place
  ): Observable<Organisation> {
    return this.http
      .get(`${this.endPoint}/addPlace/${orga._id}/${place.lieu_id}`)
      .pipe(
        map((organisation) => {
          return new Organisation(organisation, true);
        })
      );
  }

  public removePlaceFromOrga(
    orgaId: string,
    placeId: number
  ): Observable<Organisation> {
    return this.http
      .delete(`${this.endPoint}/removePlace/${orgaId}/${placeId}`)
      .pipe(
        map((organisation) => {
          return new Organisation(organisation, true);
        })
      );
  }

  public deleteOrganisation(id: string): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.endPoint}/${id}`);
  }

  public patchUserRoles(
    orgaObjectId: string,
    newUserRights: UserRightEditionPayload
  ): Observable<Organisation> {
    return this.http
      .patch(
        `${this.endPointRoles}/${orgaObjectId}/${newUserRights.userObjectId}`,
        newUserRights
      )
      .pipe(
        map((organisation) => {
          return new Organisation(organisation, true);
        })
      );
  }
}
