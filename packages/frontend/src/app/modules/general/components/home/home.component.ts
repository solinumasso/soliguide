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
import { Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";

import {
  Categories,
  GeoPosition,
  getCategoriesService,
  FlatCategoriesTreeNode,
  FlatOrderCategoriesTreeNode,
  type LocationAutoCompleteAddress,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { CurrentLanguageService } from "../../services/current-language.service";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { Search } from "../../../search/interfaces";
import { SeoService, LocationService } from "../../../shared/services";
import { smoothCollapse, IS_WEBVIEW_APP } from "../../../../shared";
import type { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-home",
  styleUrls: ["./home.component.scss"],
  templateUrl: "./home.component.html",
  animations: [smoothCollapse],
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public search = new Search();
  public me!: User | null;

  public hideCategories = false;
  public readonly IS_WEBVIEW_APP = IS_WEBVIEW_APP;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  public readonly CATEGORIES_HIGHLIGHTED: Categories[] = [
    Categories.HYGIENE_AND_WELLNESS,
    Categories.FOOD,
    Categories.WELCOME,
    Categories.COUNSELING,
    Categories.HEALTH,
    Categories.TRAINING_AND_JOBS,
    Categories.ACCOMODATION_AND_HOUSING,
    Categories.TECHNOLOGY,
    Categories.EQUIPMENT,
  ];
  public readonly CATEGORIES_NODES_WITH_ONE_DEPTH_CHILDREN: FlatCategoriesTreeNode[];

  public readonly CATEGORIES_ROOT_NODES: FlatOrderCategoriesTreeNode[];

  constructor(
    private readonly translateService: TranslateService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly seoService: SeoService,
    private readonly posthogService: PosthogService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly authService: AuthService,
    private readonly locationService: LocationService
  ) {
    this.CATEGORIES_NODES_WITH_ONE_DEPTH_CHILDREN =
      getCategoriesService().geCategoriesNodesWithOneDepthChildren();
    this.CATEGORIES_ROOT_NODES =
      getCategoriesService().getOrderRootFlatCategories();
  }

  public ngOnInit(): void {
    const title = this.translateService.instant(
      "SOLIGUIDE_THE_SOLIDARITY_GUIDE_ONLINE",
      { brandName: THEME_CONFIGURATION.brandName }
    );
    const description = this.translateService.instant("HOME_PAGE_DESCRIPTION", {
      brandName: THEME_CONFIGURATION.brandName,
    });
    this.seoService.updateTitleAndTags(title, description, true);

    this.subscription.add(
      this.translateService.onLangChange.subscribe({
        next: () => {
          this.seoService.updateTitleAndTags(
            this.translateService.instant(
              "SOLIGUIDE_THE_SOLIDARITY_GUIDE_ONLINE",
              { brandName: THEME_CONFIGURATION.brandName }
            ),
            this.translateService.instant("HOME_PAGE_DESCRIPTION", {
              brandName: THEME_CONFIGURATION.brandName,
            }),
            true
          );
        },
      })
    );
    this.subscription.add(
      this.authService.currentUserSubject.subscribe((user: User) => {
        this.me = user;
      })
    );

    const location = this.locationService.localPositionValue;

    this.search = new Search({ location });
  }

  public updateLocation = (item: LocationAutoCompleteAddress): void => {
    this.search.location = new GeoPosition(item);
  };

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public clearCategories() {
    this.search.category = null;
    this.search.label = null;

    this.hideCategories = true;

    const allCatsContainerTop =
      document.getElementById("allCats").getBoundingClientRect().top - 15;
    const yScrollfromDocumentop = window.pageYOffset;

    this.captureEvent("select-all-categories");
    window.scroll({
      behavior: "smooth",
      left: 0,
      top: yScrollfromDocumentop + allCatsContainerTop,
    });
  }

  public showCats() {
    this.captureEvent("select-all-categories");
    this.hideCategories = !this.hideCategories;
  }

  public putTextCat(value: Categories | string) {
    this.search.category = value as Categories;

    this.search.label = this.translateService.instant(value.toUpperCase());
    this.captureEvent(`select-category-${value}`);
    window.scroll({
      behavior: "smooth",
      left: 0,
      top: 0,
    });
  }

  public launchSearch() {
    const searchUrl = [this.currentLanguageService.routePrefix, "search"];

    if (this.search.location.geoValue) {
      searchUrl.push(this.search.location.geoValue);

      let categoryOrWord = "";

      if (this.search.category) {
        categoryOrWord = this.search.category;
      } else if (this.search.word) {
        categoryOrWord = encodeURI(this.search.word);
      }

      if (categoryOrWord) {
        searchUrl.push(categoryOrWord);
      }

      this.router.navigate(searchUrl);
    } else {
      this.toastr.warning(
        this.translateService.instant("PLEASE_CHOOSE_LOCATION")
      );
    }
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(
      `home-${eventName.toLocaleLowerCase()}`,
      properties
    );
  }
}
