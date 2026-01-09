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

import { SearchUsersObject } from "../classes/SearchUsers.class";
import { environment } from "../../../../environments/environment";
import { ApiMessage } from "../../../models";
import { CommonUser, SearchResults } from "@soliguide/common";
import { PasswordTokenResponse } from "src/app/models/manage-search/interfaces";

@Injectable({
  providedIn: "root",
})
export class AdminUsersService {
  private endPoint = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  public searchUsers(
    search: SearchUsersObject
  ): Observable<SearchResults<CommonUser>> {
    return this.http
      .post<SearchResults<CommonUser>>(`${this.endPoint}/search`, search)
      .pipe(
        map((response: SearchResults<CommonUser>) => {
          if (response.nbResults > 0) {
            return response;
          }
          return { nbResults: 0, results: [] };
        })
      );
  }

  public deleteUser(user: CommonUser): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.endPoint}/${user._id}`);
  }

  public removeFromDev(userObjectId: string): Observable<ApiMessage> {
    return this.http.patch<ApiMessage>(`${this.endPoint}/removeFromDev`, {
      _id: userObjectId,
    });
  }

  public createDevToken(userObjectId: string): Observable<string> {
    return this.http.get<string>(
      `${this.endPoint}/createDevToken/${userObjectId}`
    );
  }

  public generateResetPasswordToken(
    userEmail: string
  ): Observable<PasswordTokenResponse> {
    return this.http.post<PasswordTokenResponse>(
      `${environment.apiUrl}/users/forgot-password`,
      { mail: userEmail, isAdminRequest: true }
    );
  }
}
