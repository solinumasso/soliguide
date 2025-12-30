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

import {
  ALL_SUPPORTED_LANGUAGES_NAME,
  SUPPORTED_LANGUAGES,
  WIDGETS_AVAILABLE,
  WidgetId,
  Categories,
} from "@soliguide/common";

import { WIDGETS } from "../../../../models";

import { ThemeService } from "../../../../services/theme.service";

import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-help-search",
  templateUrl: "./help-search.component.html",
  styleUrls: ["./help-search.component.scss"],
})
export class HelpSearchComponent implements OnInit {
  public availableCategories: Categories[] = [
    Categories.INFORMATION_POINT,
    Categories.DOMICILIATION,
    Categories.CLOTHING,
    Categories.DAY_HOSTING,
    Categories.FOOD,
    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
    Categories.WIFI,
    Categories.FRENCH_COURSE,
    Categories.PSYCHOLOGICAL_SUPPORT,
    Categories.HEALTH,
  ];

  public generatedUrlPass = "";
  public generatedUrls: { [key in Categories]?: string } = {};
  public readonly widgetUrl = environment.widgetUrl;

  public currentLang!: string;

  public readonly ALL_SUPPORTED_LANGUAGES_NAME = ALL_SUPPORTED_LANGUAGES_NAME;
  public readonly SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
  public readonly WIDGETS_AVAILABLE = WIDGETS_AVAILABLE;
  public readonly WIDGETS = WIDGETS;

  public selectedWidget: WidgetId = WidgetId.SOLINUM;

  constructor(private themeService: ThemeService) {
    this.currentLang = "fr";
  }

  public ngOnInit(): void {
    this.themeService.setWidgetId(this.selectedWidget);
    this.generateUrls();
  }

  public setWidgetId(widgetId: WidgetId): void {
    this.selectedWidget = widgetId;
    this.themeService.setWidgetId(widgetId);
    this.generateUrls();
  }

  public generateUrls() {
    this.generatedUrls = {};
    this.availableCategories.forEach((category: Categories) => {
      const text = `<iframe aria-label="Soliguide" height="490px" style="width: 100%; display: block; margin: 0 auto" title="Widget Soliguide" src="${this.widgetUrl}/search/${this.selectedWidget}/${this.currentLang}/${category}" frameborder="0"></iframe>`;
      this.generatedUrls[category] = text;
    });

    this.generatedUrlPass = `<iframe aria-label="Soliguide" height="490px" style="width: 100%; display: block; margin: 0 auto" title="Widget Soliguide" src="${this.widgetUrl}/search/${this.selectedWidget}/${this.currentLang}/PASS" frameborder="0"></iframe>`;
  }

  public updateLang(lang: string) {
    this.currentLang = lang;
    this.generateUrls();
  }
}
