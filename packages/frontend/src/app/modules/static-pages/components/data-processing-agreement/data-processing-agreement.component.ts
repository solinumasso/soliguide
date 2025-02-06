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
import { NgComponentOutlet } from "@angular/common";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { DataProcessingAgreementService } from "../../services/data-processing-agreement.service";
import { SeoService } from "../../../shared/services";
import { StaticPagesComponentAbstract } from "../static-pages-component.abstract";
import { TranslateService } from "@ngx-translate/core";

@Component({
  standalone: true,
  imports: [NgComponentOutlet],
  selector: "app-data-processing-agreement",
  template: '<ng-container *ngComponentOutlet="currentTemplate" />',
})
export class DataProcessingAgreementComponent
  extends StaticPagesComponentAbstract
  implements OnInit
{
  constructor(
    private readonly translateService: TranslateService,
    private readonly seoService: SeoService,
    private readonly dataProcessingAgreementService: DataProcessingAgreementService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    super();
  }

  public ngOnInit(): void {
    const title = this.translateService.instant(
      "STATIC_PAGE_DATA_PROCESSING_AGREEMENT_TITLE"
    );
    const description = this.translateService.instant(
      "STATIC_PAGE_DATA_PROCESSING_AGREEMENT_DESCRIPTION"
    );

    this.seoService.updateTitleAndTags(title, description, true);
    this.currentTemplate =
      this.dataProcessingAgreementService.getDataProcessingAgreementComponentByName(
        this.theme,
        this.currentLanguageService.currentLanguage
      );
  }
}
