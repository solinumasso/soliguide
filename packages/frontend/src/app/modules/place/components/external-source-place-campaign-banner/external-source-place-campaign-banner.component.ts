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

import { CAMPAIGN_DEFAULT_NAME, PairingSources } from "@soliguide/common";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { CAMPAIGN_LIST, Place, THEME_CONFIGURATION } from "../../../../models";
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

  public readonly CAMPAIGN_DATE_DEBUT_AFFICHAGE =
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateDebutAffichage;

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

    const hasExternalSource =
      Array.isArray(this.place.sources) &&
      this.place.sources.some(
        (s) => EXTERNAL_SOURCES.includes(s.name) && s.isOrigin === true
      );

    // Show banner for external sources if last update was before campaign and we're after campaign start
    this.shouldShowExternalBanner =
      hasExternalSource &&
      this.place.updatedByUserAt < this.CAMPAIGN_DATE_DEBUT_AFFICHAGE &&
      new Date() >= this.CAMPAIGN_DATE_DEBUT_AFFICHAGE;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
