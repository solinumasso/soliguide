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

import { User } from "../classes";
import { UserEdit, UserSignup } from "../types";

import { ApiMessage } from "../../../models";

import { environment } from "../../../../environments/environment";
import { CommonUser } from "@soliguide/common";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private endPoint = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  public get getEndPoint(): string {
    return this.endPoint;
  }

  public signupTranslator(user: UserSignup): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(
      `${this.endPoint}/signup-translator/`,
      user
    );
  }

  public signup(user: UserSignup): Observable<string> {
    return user.invitation
      ? this.http.post<string>(
          `${environment.apiUrl}/invite-user/accept-first-invitation/${user.invitation}`,
          user
        )
      : this.http.post<string>(`${this.endPoint}/signup/`, user);
  }

  public updateUser(
    userEditDatas: UserEdit,
    userObjectId: string
  ): Observable<ApiMessage> {
    return this.http.patch<ApiMessage>(
      `${this.endPoint}${userObjectId}`,
      userEditDatas
    );
  }

  // Editer mon compte
  public updateMyAccount(userEditDatas: UserEdit): Observable<User> {
    return this.http
      .patch<CommonUser>(`${this.endPoint}me`, userEditDatas)
      .pipe(
        map((user: CommonUser) => {
          return new User(user);
        })
      );
  }

  public getUser(id: string): Observable<User> {
    return this.http.get<CommonUser>(`${this.endPoint}${id}`).pipe(
      map((user: CommonUser) => {
        return new User(user);
      })
    );
  }

  public sendResetPwdEmail(data: { mail: string }): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.endPoint}forgot-password`, data);
  }

  public checkPasswordToken(token: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.endPoint}check-password-token/${token}`
    );
  }

  public resetPassword(data: {
    password: string;
    token: string;
  }): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(
      `${this.endPoint}reset-password/${data.token}`,
      data
    );
  }

  public checkEmailAlreadyUsed(mail: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.endPoint}test-email-exist`, {
      mail,
    });
  }
}
