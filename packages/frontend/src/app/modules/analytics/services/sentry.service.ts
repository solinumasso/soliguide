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
import { Injectable, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";

import { environment } from "../../../../environments/environment";
import { User } from "../../users/classes";
import { AuthService } from "../../users/services/auth.service";
import { getCurrentScope } from "@sentry/angular";

@Injectable({
  providedIn: "root",
})
export class SentryService implements OnDestroy {
  private readonly subscription: Subscription;
  public readonly enabled = environment.sentryDsn;

  public constructor(private readonly authService: AuthService) {
    this.subscription = new Subscription();
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public registerUserChange() {
    if (this.enabled) {
      this.subscription.add(
        this.authService.currentUserSubject.subscribe((user: User | null) => {
          if (user) {
            getCurrentScope().setUser({
              email: user.mail,
              isAdmin: user.admin,
              role: user.role,
              lastname: user.lastname,
              name: user.name,
            });
          } else {
            getCurrentScope().setTag("organisation", "none");
            getCurrentScope().setUser({});
          }
        })
      );
    }
  }
}
