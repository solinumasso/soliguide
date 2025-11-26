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
import { NgComponentOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../../../../models";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { SeoService } from "../../../shared/services";
import { CookiePolicyService } from "../../services/cookie-policy.service";
import { StaticPagesComponentAbstract } from "../static-pages-component.abstract";
import { combineLatest } from "rxjs";

@Component({
  standalone: true,
  imports: [NgComponentOutlet],
  selector: "app-cookie-policy",
  template: '<ng-container *ngComponentOutlet="currentTemplate" />',
})
export class CookiePolicyComponent
  extends StaticPagesComponentAbstract
  implements OnInit
{
  constructor(
    private readonly translateService: TranslateService,
    private readonly seoService: SeoService,
    private readonly cookiePolicyService: CookiePolicyService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    super();
  }

  public ngOnInit(): void {
    const params = { brandName: THEME_CONFIGURATION.brandName };

    combineLatest([
      this.translateService.stream("STATIC_PAGE_COOKIE_POLICY_TITLE"),
      this.translateService.stream(
        "STATIC_PAGE_COOKIE_POLICY_DESCRIPTION",
        params
      ),
    ]).subscribe(([title, description]) => {
      this.seoService.updateTitleAndTags(title, description, true);
    });

    this.currentTemplate =
      this.cookiePolicyService.getCookiePolicyComponentByName(
        this.theme,
        this.currentLanguageService.currentLanguage
      );
  }
}
