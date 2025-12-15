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
import { Component } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { SupportedLanguagesCode } from "@soliguide/common";

import { environment } from "../../../../../environments/environment";
import { IframeGeneratorStep } from "../../types";
import { AnalyticsService } from "../../services/analytics.service";

@Component({
  selector: "app-intro-form",
  templateUrl: "./intro-form.component.html",
  styleUrls: ["./intro-form.component.scss"],
})
export class IntroFormComponent {
  public frontendUrl = `${environment.frontendUrl}/`;
  public currentLang: string;
  public readonly SupportedLanguagesCode = SupportedLanguagesCode;

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly translateService: TranslateService
  ) {
    this.currentLang = this.translateService.currentLang;
  }

  public async captureClickSoliguideLink() {
    this.analyticsService.capture(
      "click-link-soliguide",
      IframeGeneratorStep.INTRO
    );
  }

  public async captureClickContactEmail() {
    this.analyticsService.capture(
      "click-contact-email",
      IframeGeneratorStep.INTRO
    );
  }
}
