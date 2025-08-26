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
import { Injectable, OnDestroy, Optional } from "@angular/core";
import { NavigationEnd, Router, Event } from "@angular/router";
import { filter, Subscription } from "rxjs";

import { PosthogService } from "./posthog.service";

@Injectable({
  providedIn: "root",
})
export class PosthogRouterInitService implements OnDestroy {
  private readonly subscription: Subscription;

  public constructor(
    private readonly posthogService: PosthogService,
    @Optional() private readonly router?: Router
  ) {
    this.subscription = new Subscription();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public subscribeToRouteChange(): void {
    if (this.posthogService.canBeEnabled && this.router) {
      this.subscription.add(
        this.router.events
          .pipe(filter((event: Event) => event instanceof NavigationEnd))
          .subscribe(() => {
            this.onRouteChange();
          })
      );
    }
  }

  private onRouteChange(): void {
    this.subscription.add(
      this.posthogService.posthogInstance.subscribe((posthogInstance) => {
        if (posthogInstance) {
          posthogInstance.capture("$pageview");
        }
      })
    );
  }
}
