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
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../modules/users/services/auth.service";
import { Observable, of } from "rxjs";
import { DashboardPublic } from "../models";

const publicDashboards: string[] = Object.values(DashboardPublic);

@Injectable({ providedIn: "root" })
export class SolidataGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  private convertToCamelCase(dashStr: string): string {
    return dashStr
      .replace(/-([a-z])/g, (_, group1) => group1.toUpperCase())
      .replace(/^([a-z])/, (_, group1) => group1.toLowerCase());
  }

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const superset = route.params["superset"];
    const camelCaseSuperset = this.convertToCamelCase(superset);

    if (publicDashboards.includes(camelCaseSuperset)) {
      return of(true);
    } else {
      this.authService.notAuthorized();
      return of(false);
    }
  }
}
