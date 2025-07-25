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
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import {
  CAMPAIGN_DEFAULT_NAME,
  PlaceStatus,
  UserRole,
  CAMPAIGN_LIST,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import type { Organisation } from "../../interfaces";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import type { User } from "../../../users/classes";
import { THEME_CONFIGURATION } from "../../../../models";
import { campaignIsActiveWithTheme } from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-organization-update-campaign-banner",
  templateUrl: "./organization-update-campaign-banner.component.html",
  styleUrls: ["./organization-update-campaign-banner.component.css"],
})
export class OrganizationUpdateCampaignBannerComponent
  implements OnInit, OnDestroy
{
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  @Input() public me!: User | null;
  @Input() public organisation: Organisation;

  public campaignIsActive: boolean;
  public canEdit: boolean;
  public needUpdated: boolean;

  public routePrefix: string;

  public readonly CAMPAIGN_DEFAULT_NAME = CAMPAIGN_DEFAULT_NAME;
  public readonly CAMPAIGN_DATE_DEBUT_AFFICHAGE =
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateDebutAffichage;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService
  ) {
    this.canEdit = false;
    this.needUpdated = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    const now = new Date();

    this.campaignIsActive = campaignIsActiveWithTheme(
      this.organisation.territories
    );

    this.canEdit =
      this.me.admin ||
      (this.me.role !== UserRole.READER && this.me.places.length > 0);

    for (const place of this.organisation.places) {
      const remindMeDateSaved = place.campaigns.runningCampaign.remindMeDate
        ? new Date(`${place.campaigns.runningCampaign.remindMeDate}`).getTime()
        : 0;

      if (
        [PlaceStatus.ONLINE, PlaceStatus.OFFLINE].includes(place.status) &&
        place.campaigns.runningCampaign.toUpdate &&
        !(
          place.campaigns.runningCampaign.general.updated ||
          remindMeDateSaved >= now.getTime()
        )
      ) {
        this.needUpdated = true;
        break;
      }
    }

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`admin-organization-${eventName}`, {
      ...properties,
      organizationId: this.organisation.organization_id,
      campaignIsActive: this.campaignIsActive,
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
