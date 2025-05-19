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
import {
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
  type TemplateRef,
  ViewChild,
} from "@angular/core";
import { ViewportScroller } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import {
  CAMPAIGN_DEFAULT_NAME,
  PlaceStatus,
  TERRITORIES_NOTIF,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { CampaignService } from "../../services/campaign.service";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import type { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { THEME_CONFIGURATION } from "../../../../models";
import { CAMPAIGN_LIST } from "../../../../models/campaign";
import type { Place } from "../../../../models/place";

import {
  DEFAULT_MODAL_OPTIONS,
  getMinDateToday,
} from "../../../../shared/constants";
import { globalConstants } from "../../../../shared/functions";

@Component({
  selector: "app-campaign-manage-places",
  templateUrl: "./campaign-manage-places.component.html",
  styleUrls: [
    "./campaign-manage-places.component.css",
    "../campaign-form-place/campaign-form-place.component.css",
  ],
})
export class CampaignManagePlacesComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();
  public places: Place[];
  public selectedPlace: Place;
  public remindMeDate: string;

  public orgaId: number;

  public readonly MIN_DATE_TODAY = getMinDateToday();

  public me!: User;

  public canScroll: boolean;

  public emailsTerritories: string;

  public loading: boolean;
  public routePrefix: string;

  public readonly PlaceStatus = PlaceStatus;

  @ViewChild("remindMeModal", { static: true })
  public remindMeModal!: TemplateRef<NgbModalRef>;

  @ViewChild("noChangeModal", { static: true })
  public noChangeModal!: TemplateRef<NgbModalRef>;

  constructor(
    private readonly titleService: Title,
    private readonly campaignService: CampaignService,
    private readonly route: ActivatedRoute,
    private readonly viewportScroller: ViewportScroller,
    private readonly toastr: ToastrService,
    private readonly modalService: NgbModal,
    private readonly authService: AuthService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService,
    private readonly translateService: TranslateService
  ) {
    this.places = [];
    this.remindMeDate = null;

    this.orgaId = null;
    this.emailsTerritories = null;
    this.canScroll = false;
    this.loading = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.me = this.authService.currentUserValue;
    this.titleService.setTitle(
      CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].description
    );
    if (!this.me.admin) {
      this.orgaId = this.me.currentOrga.organization_id;
      this.emailsTerritories = this.me.currentOrga.territories
        .filter((territory) => territory && territory.toString() !== "")
        .map((territory) => TERRITORIES_NOTIF[territory].senderEmail)
        .filter((email) => email)
        .toString();
    } else if (this.route.snapshot.params.organization_id) {
      this.orgaId = parseInt(this.route.snapshot.params.organization_id, 10);
    }

    if (this.orgaId !== null && this.orgaId >= 0) {
      this.subscription.add(
        this.campaignService
          .getPlacesForCampaign(this.orgaId)
          .subscribe((places: Place[]) => {
            this.places = places;
            this.titleService.setTitle(
              this.translateService.instant("CAMPAIGN_GENERAL_VIEW")
            );
          })
      );
    }

    this.remindMeDate = null;

    this.canScroll = true;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public ngAfterViewChecked(): void {
    const lastPosition = globalConstants.getItem("lastCampaignPosition");
    if (lastPosition !== null && this.canScroll) {
      this.viewportScroller.scrollToAnchor(lastPosition);
      this.canScroll = false;
      setTimeout(() => {
        globalConstants.setItem("lastCampaignPosition", null);
      }, 2000);
    }
  }

  public openModal(
    place: Place,
    modal: TemplateRef<NgbModalRef>,
    modalType: string
  ): void {
    this.captureEvent("click-open-modal-" + modalType, {
      placeId: place.lieu_id,
    });

    this.selectedPlace = place;
    this.canScroll = false;
    this.modalService.open(modal, DEFAULT_MODAL_OPTIONS);
  }

  public setRemindMeLater(): void {
    const date = this.remindMeDate ? new Date(this.remindMeDate) : null;
    this.loading = true;

    this.captureEvent("click-set-remind-me-later-button", {
      placeId: this.selectedPlace.lieu_id,
      date,
    });

    this.subscription.add(
      this.campaignService
        .setRemindMeLater(this.selectedPlace.lieu_id, date)
        .subscribe({
          next: (place: Place) => {
            this.toastr.success(
              this.translateService.instant("REMINDER_SAVED_SUCCESSFULLY")
            );
            this.selectedPlace.campaigns.runningCampaign.remindMeDate =
              place.campaigns.runningCampaign.remindMeDate;
            this.modalService.dismissAll();
            this.selectedPlace = null;
            this.loading = false;
          },
          error: () => {
            this.modalService.dismissAll();
            this.toastr.error(
              this.translateService.instant("REMINDER_SAVE_FAIL")
            );
            this.loading = false;
          },
        })
    );
  }

  public cancelModal(modalType: string, buttonType: string): void {
    this.captureEvent(`click-cancel-modal-${modalType}-${buttonType}`, {
      placeId: this.selectedPlace.lieu_id,
    });

    this.modalService.dismissAll();
    this.selectedPlace = null;
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`campaign-manage-places-${eventName}`, {
      ...properties,
      organization_id: this.orgaId,
      campaign: CAMPAIGN_DEFAULT_NAME,
    });
  }
}
