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
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";

import { Search } from "../../interfaces";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { PosthogService } from "../../../analytics/services/posthog.service";
import {
  FlatCategoriesTreeNode,
  getCategoriesService,
} from "@soliguide/common";
import { Subscription } from "rxjs";

@Component({
  selector: "app-search-nav",
  templateUrl: "./search-nav.component.html",
  styleUrls: ["./search-nav.component.css"],
})
export class SearchNavComponent implements OnInit, OnDestroy, OnChanges {
  private readonly subscription = new Subscription();
  public routePrefix: string;

  public readonly CATEGORIES_ROOTS =
    getCategoriesService().getOrderRootCategoriesIds();

  public categoryParentNode: FlatCategoriesTreeNode;

  @Input({ required: true }) public search: Search;

  constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService
  ) {
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.routePrefix = this.currentLanguageService.routePrefix;
      })
    );
    this.updateCategoryNode();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["search"]) {
      if (this.search) {
        this.updateCategoryNode();
      }
    }
  }

  private updateCategoryNode(): void {
    if (!this.search.category) {
      this.categoryParentNode = null;
      return;
    }

    const categoriesService = getCategoriesService();
    const parentCategories = categoriesService.getParentsCategories(
      this.search.category
    );

    const categoryParent = parentCategories[0];

    if (categoryParent) {
      this.categoryParentNode =
        categoriesService.getFlatCategoryTreeNode(categoryParent);
      return;
    }

    this.categoryParentNode = categoriesService.getFlatCategoryTreeNode(
      this.search.category
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public captureEvent(eventName: string) {
    this.posthogService.capture(`search-nav-${eventName}`, {
      search: this.search,
    });
  }
}
