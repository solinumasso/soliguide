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
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

import { THEME_CONFIGURATION } from "src/app/models";
import { CurrentLanguageService } from "src/app/modules/general/services/current-language.service";

@Component({
  selector: "app-pro-create-account",
  templateUrl: "./pro-create-account.component.html",
  styleUrls: ["./pro-create-account.component.css"],
})
export class ProCreateAccountComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  public routePrefix = "";

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly titleService: Title,
    private readonly translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("SIGNUP_SOLIGUIDE", {
        brandName: THEME_CONFIGURATION.brandName,
      })
    );

    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.routePrefix = this.currentLanguageService.routePrefix;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
