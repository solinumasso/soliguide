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
import { ActivatedRoute } from "@angular/router";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";

import { PlaceChangesService } from "../../services/place-changes.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import { PlaceChanges, THEME_CONFIGURATION } from "../../../../models";
import { CAMPAIGN_LIST, UserStatus } from "@soliguide/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-place-changes-page",
  templateUrl: "./place-changes-page.component.html",
  styleUrls: ["./place-changes-page.component.css"],
})
export class PlaceChangesPageComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public me!: User | null;

  public placeChanges: PlaceChanges;

  public photosChanged: boolean;
  public routePrefix: string;
  public readonly CAMPAIGN_LIST = CAMPAIGN_LIST;
  public readonly UserStatus = UserStatus;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    private readonly placeChangesService: PlaceChangesService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly titleService: Title,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.photosChanged = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.me = this.authService.currentUserValue;

    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params.placeChangesObjectId) {
          const placeChangesObjectId = params.placeChangesObjectId;

          this.subscription.add(
            this.placeChangesService
              .getVersion(placeChangesObjectId)
              .subscribe((changes: PlaceChanges) => {
                const title = this.translateService.instant("UPDATE_OF");
                const sectionLabel = this.translateService.instant(
                  `PLACE_CHANGES_SECTION_${changes.section.toUpperCase()}`
                );
                this.titleService.setTitle(
                  `${title} ${sectionLabel} - ${changes.lieu_id}`
                );
                this.placeChanges = changes;

                // Todo: create a function to really check difference between old pictures & new pictures
                this.photosChanged =
                  JSON.stringify(this.placeChanges.old) !==
                  JSON.stringify(this.placeChanges.new);
              })
          );
        } else {
          this.toastr.error(
            this.translateService.instant("SEARCHED_CHANGE_NON_EXISTANT")
          );
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
