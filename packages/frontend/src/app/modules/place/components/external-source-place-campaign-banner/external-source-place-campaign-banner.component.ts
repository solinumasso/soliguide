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
import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import {
  PairingSources,
  getPosition,
  type SoliguideCountries,
  CountryCodes,
  getDepartmentCodeFromPostalCode,
} from "@soliguide/common";
import { campaignIsActive } from "../../../../shared";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { Place, THEME_CONFIGURATION } from "../../../../models";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { Subscription } from "rxjs";

// Define this constant outside the class
const EXTERNAL_SOURCES: string[] = Object.values(PairingSources);

@Component({
  selector: "app-external-source-place-campaign-banner",
  templateUrl: "./external-source-place-campaign-banner.component.html",
  styleUrls: ["./external-source-place-campaign-banner.component.css"],
})
export class ExternalSourcePlaceCampaignBannerComponent
  extends PosthogComponent
  implements OnInit, OnDestroy
{
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  @Input() public canEdit!: boolean;
  @Input() public place!: Place;

  public shouldShowExternalBanner = false;
  public routePrefix: string;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    posthogService: PosthogService
  ) {
    super(posthogService, "update-campaign-banner");
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    const position = getPosition(this.place);
    const postalCode = position.postalCode;
    const country = position.country;

    const isFromExternalSource = this.place.sources.some(
      (source) =>
        EXTERNAL_SOURCES.includes(source.name) && source.isOrigin === true
    );

    const campaignIsActiveForPlace =
      country &&
      postalCode &&
      THEME_CONFIGURATION.country === CountryCodes.FR &&
      campaignIsActive([
        getDepartmentCodeFromPostalCode(
          country as SoliguideCountries,
          postalCode
        ),
      ]);

    this.shouldShowExternalBanner =
      isFromExternalSource && campaignIsActiveForPlace;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
