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
import { PosthogService as CommonPosthogService } from "@soliguide/common-angular";

@Injectable({
  providedIn: "root",
})
export class PosthogService implements OnDestroy {
  private readonly subscription: Subscription;

  public constructor(
    private readonly commonPosthogService: CommonPosthogService
  ) {
    this.commonPosthogService.switchPersistence("memory");
    this.subscription = new Subscription();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public capture(eventName: string, properties?: Record<string, any>) {
    this.commonPosthogService.capture(`widget-${eventName}`, properties);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public identify(email: string, properties?: Record<string, any>) {
    this.commonPosthogService.identify(email, properties);
  }
}
