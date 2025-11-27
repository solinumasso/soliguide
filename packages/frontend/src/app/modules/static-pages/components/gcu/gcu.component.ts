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
import { Component, OnInit } from "@angular/core";
import { SeoService } from "../../../shared/services";
import { NgComponentOutlet } from "@angular/common";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { GcuService } from "../../services/gcu.service";
import { StaticPagesComponentAbstract } from "../static-pages-component.abstract";
import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../../../../models";
import { combineLatest } from "rxjs";

@Component({
  standalone: true,
  imports: [NgComponentOutlet],
  selector: "app-gcu",
  template: '<ng-container *ngComponentOutlet="currentTemplate" />',
})
export class GcuComponent
  extends StaticPagesComponentAbstract
  implements OnInit
{
  constructor(
    private readonly translateService: TranslateService,
    private readonly seoService: SeoService,
    private readonly gcuService: GcuService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    super();
  }

  public ngOnInit(): void {
    const params = { brandName: THEME_CONFIGURATION.brandName };

    combineLatest([
      this.translateService.stream("STATIC_PAGE_GCU_TITLE", params),
      this.translateService.stream("STATIC_PAGE_GCU_DESCRIPTION", params),
    ]).subscribe(([title, description]) => {
      this.seoService.updateTitleAndTags(title, description, true);
    });

    this.currentTemplate = this.gcuService.getGCUComponentByName(
      this.theme,
      this.currentLanguageService.currentLanguage
    );
  }
}
