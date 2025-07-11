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

import {
  PosthogService as CommonPosthogService,
  type PosthogProperties,
} from "@soliguide/common-angular";
import { CookieManagerService } from "../../shared";

@Injectable({
  providedIn: "root",
})
export class PosthogService implements OnDestroy {
  private readonly subscription: Subscription;

  public constructor(
    private readonly commonPosthogService: CommonPosthogService,
    private readonly cookieManagerService: CookieManagerService
  ) {
    this.subscription = new Subscription();

    this.subscription.add(
      this.cookieManagerService.analyticsConsentSubject.subscribe(
        (consent: boolean) => {
          if (consent) {
            this.commonPosthogService.switchPersistence("localStorage+cookie");
          } else {
            this.commonPosthogService.switchPersistence("memory");
          }
        }
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public capture(eventName: string, properties?: PosthogProperties): void {
    this.commonPosthogService.capture(`frontend-${eventName}`, properties);
  }
}
