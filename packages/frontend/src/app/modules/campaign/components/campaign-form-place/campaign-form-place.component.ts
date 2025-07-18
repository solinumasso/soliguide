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
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import {
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  CampaignSource,
  PlaceType,
} from "@soliguide/common";

import { Subscription } from "rxjs";

import { AdminPlaceService } from "../../../form-place/services/admin-place.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { Place } from "../../../../models/place/classes";

import { globalConstants } from "./../../../../shared/functions";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-campaign-form-place",
  templateUrl: "./campaign-form-place.component.html",
  styleUrls: ["./campaign-form-place.component.css"],
})
export class CampaignFormPlaceComponent
  extends PosthogComponent
  implements OnInit, OnDestroy
{
  private readonly subscription = new Subscription();
  public place: Place;
  public me!: User | null;

  public orgaId: number | null;
  public routePrefix: string;

  public readonly CAMPAIGN_ADJ = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].adjective;
  public readonly CAMPAIGN_DESCRIPTION =
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].description;
  public readonly CAMPAIGN_NAME = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].name;
  public readonly CampaignSource = CampaignSource;
  public readonly PlaceType = PlaceType;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    private readonly adminPlaceService: AdminPlaceService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly currentLanguageService: CurrentLanguageService,
    posthogService: PosthogService
  ) {
    super(posthogService, "campaign-form-");
    this.orgaId = null;
    this.place = null;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.updateDefaultPosthogProperties({
      campaignIsActive: true,
      campaign: CAMPAIGN_DEFAULT_NAME,
    });

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.me = this.authService.currentUserValue;

    const id: number = parseInt(this.route.snapshot.params.lieu_id, 10);

    this.subscription.add(
      this.adminPlaceService.getPlace(id, true).subscribe({
        next: (place: Place) => {
          this.place = place;

          this.updateDefaultPosthogProperties({ place: this.place });

          globalConstants.setItem("lastCampaignPosition", "place-" + id);

          this.titleService.setTitle(
            `${this.CAMPAIGN_DESCRIPTION} : ${this.place.name}`
          );

          if (this.me.admin) {
            this.subscription.add(
              this.route.queryParams.subscribe((params) => {
                this.orgaId = params.orgaid
                  ? parseInt(params.orgaid, 10)
                  : null;
              })
            );
          } else {
            this.orgaId = this.me.currentOrga.organization_id;
          }
        },
        error: () => {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "fiche",
            id,
          ]);
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public updatePlace = (place: Place): void => {
    this.place = place;
  };

  public updateStep = (currentStep: number): void => {
    this.captureEvent({
      name: "click-step-number",
      properties: { selectedStep: currentStep },
    });

    if (currentStep <= this.place.campaigns.runningCampaign.currentStep) {
      this.place.campaigns.runningCampaign.currentStep = currentStep;
    } else {
      switch (currentStep) {
        case 1:
          this.place.campaigns.runningCampaign.currentStep = this.place
            .campaigns.runningCampaign.sections.tempClosure.updated
            ? 1
            : 0;
          break;
        case 2:
          this.place.campaigns.runningCampaign.currentStep = this.place
            .campaigns.runningCampaign.sections.hours.updated
            ? 2
            : this.place.campaigns.runningCampaign.currentStep;
          break;
        case 3:
          this.place.campaigns.runningCampaign.currentStep = this.place
            .campaigns.runningCampaign.sections.services.updated
            ? 3
            : this.place.campaigns.runningCampaign.currentStep;
          break;
        case 4:
          this.place.campaigns.runningCampaign.currentStep = this.place
            .campaigns.runningCampaign.sections.tempMessage.updated
            ? 4
            : this.place.campaigns.runningCampaign.currentStep;
          break;
        default:
          this.place.campaigns.runningCampaign.currentStep = currentStep;
          break;
      }
    }
  };
}
