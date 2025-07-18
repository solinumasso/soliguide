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

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import {
  CAMPAIGN_DEFAULT_NAME,
  UserStatus,
  CAMPAIGN_LIST,
} from "@soliguide/common";

import { TranslateService } from "@ngx-translate/core";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";

import { CampaignService } from "../../../campaign/services/campaign.service";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import { Place } from "../../../../models/place/classes/place.class";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { PosthogComponent } from "../../../analytics/components/posthog.component";

@Component({
  selector: "app-campaign-no-change-modal",
  templateUrl: "./campaign-no-change-modal.component.html",
  styleUrls: ["./campaign-no-change-modal.component.css"],
})
export class CampaignNoChangeModalComponent
  extends PosthogComponent
  implements OnInit, OnDestroy
{
  @Input() public place!: Place;

  public me!: User;
  public loading = false;

  public readonly UserStatus = UserStatus;

  public readonly CAMPAIGN_ADJ = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].adjective;
  public readonly CAMPAIGN_NAME = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].name;

  private readonly subscription = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private readonly campaignService: CampaignService,
    private readonly modalService: NgbModal,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    posthogService: PosthogService
  ) {
    super(posthogService, "campaign-no-change-modal-");
    this.place = new Place();
  }

  public ngOnInit(): void {
    this.me = this.authService.currentUserValue;
    this.updateDefaultPosthogProperties({
      place: this.place,
      campaignIsActive: true,
      campaign: CAMPAIGN_DEFAULT_NAME,
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public close = (buttonType: string): void => {
    this.captureEvent({ name: `click-cancel-button-${buttonType}` });
    this.modalService.dismissAll();
  };

  public setNoChangeForPlace = (): void => {
    this.captureEvent({ name: "click-set-no-change-for-place-button" });

    this.loading = true;
    this.subscription.add(
      this.campaignService.setNoChangeForPlace(this.place.lieu_id).subscribe({
        next: (place: Place) => {
          this.place.campaigns = place.campaigns;
          this.modalService.dismissAll();
          this.loading = false;
          this.toastr.success(
            this.translateService.instant(
              "YOUR_UPDATE_HAS_BEEN_CORRECTLY_SAVED"
            )
          );
        },
        error: () => {
          this.modalService.dismissAll();
          this.loading = false;
          this.toastr.error(
            this.translateService.instant("UNABLE_TO_SAVE_YOUR_NO_CHANGES")
          );
        },
      })
    );
  };
}
