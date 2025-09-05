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
import { ActivatedRouteSnapshot, Router } from "@angular/router";

import { SupportedLanguagesCode, UserForAuth } from "@soliguide/common";

import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { User } from "../classes";
import { CurrentLanguageService } from "../../general/services/current-language.service";

import { environment } from "../../../../environments/environment";

import { TranslateService } from "@ngx-translate/core";
import { globalConstants } from "../../../shared/functions";

const AUTH_END_POINT: string = `${environment.apiUrl}users/`;
@Injectable({
  providedIn: "root",
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<User | null>;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      globalConstants.getItem("USER")
    );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public login(mail: string, password: string): Observable<User> {
    return this.http
      .post<{ token: string; user: UserForAuth }>(`${AUTH_END_POINT}signin`, {
        mail,
        password,
      })
      .pipe(
        map((response: { token: string; user: UserForAuth }) => {
          const user = new User(response.user);
          this.updateCurrentUser(user, response.token);
          return user;
        })
      );
  }

  public isAuth(): Observable<boolean> {
    // No token
    if (!globalConstants.getItem("USER")) {
      this.currentUserSubject.next(null);
      return of(false);
    }

    return this.http.get<UserForAuth>(`${AUTH_END_POINT}me`).pipe(
      map((response: UserForAuth | null) => {
        if (!response) {
          this.currentUserSubject.next(null);
          return false;
        }

        if (response) {
          const user = new User(response);

          // Languages returned by the API are in capital letters
          user.languages = response?.languages.map(
            (language) => language.toLowerCase() as SupportedLanguagesCode
          );

          this.updateCurrentUser(user);
        }

        return true;
      }),
      catchError(() => {
        globalConstants.clearStorage();
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }

  public logout(): void {
    this.currentUserSubject.next(null);
    globalConstants.clearStorage();
  }

  public logoutAndRedirect(state?: ActivatedRouteSnapshot): void {
    this.logout();

    if (state) {
      let returnUrl = `/${state.url.join("/")}`;

      if (state.children.length > 0) {
        returnUrl += `/${state.children
          .map((childRoute) => childRoute.url.join("/"))
          .join("/")}`;
      }

      const queryString = this.buildQueryString(state.queryParams);
      if (queryString) {
        returnUrl += `?${queryString}`;
      }

      this.router.navigate(
        [this.currentLanguageService.routePrefix, "connexion"],
        {
          queryParams: { returnUrl },
        }
      );
    } else {
      this.router.navigate([
        this.currentLanguageService.routePrefix,
        "connexion",
      ]);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private buildQueryString(params: Record<string, unknown>): string {
    return Object.entries(params)
      .filter(([value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
  }

  public notAuthorized(): void {
    this.toastr.error(
      this.translateService.instant("NOT_AUTHORIZED_TO_ACCESS")
    );
    this.router.navigate([this.currentLanguageService.routePrefix]);
  }

  public changeCurrentOrga(index: number): Observable<User> {
    return this.http
      .patch<UserForAuth>(`${AUTH_END_POINT}current-orga`, {
        index,
      })
      .pipe(
        map((newApiUser: UserForAuth) => {
          const newUser = new User(newApiUser);
          this.updateCurrentUser(newUser);
          return newUser;
        })
      );
  }

  public updateCurrentUser(user: User, token?: string): void {
    user.token = token
      ? token
      : this.currentUserValue?.token
      ? this.currentUserValue.token
      : user.token;
    globalConstants.setItem("USER", user);
    this.currentUserSubject.next(user);
  }
}
