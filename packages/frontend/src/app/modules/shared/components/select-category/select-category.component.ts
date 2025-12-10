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
import { TranslateService } from "@ngx-translate/core";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import {
  Categories,
  getCategoriesService,
  getCategoryTranslationKey,
} from "@soliguide/common";

@Component({
  selector: "app-select-category",
  templateUrl: "./select-category.component.html",
  styleUrls: ["./select-category.component.css"],
})
export class SelectCategoryComponent implements OnInit {
  @Input() public label!: string;
  @Input() public submitted!: boolean;
  @Input() public categories!: Categories[];
  @Input() public isRequired!: boolean;

  public categoriesToHide: Categories[];
  public newCategoriesLimitations: Categories[];
  public displayValue: string;

  public haveBeenTouched = false;

  @Output() public readonly selectedCategories = new EventEmitter<
    Categories[]
  >();

  public readonly CATEGORIES_NODES_WITH_ONE_DEPTH_CHILDREN =
    getCategoriesService().geCategoriesNodesWithOneDepthChildren();

  constructor(private readonly translateService: TranslateService) {
    this.categoriesToHide = [];
    this.categories = [];
  }

  public ngOnInit(): void {
    this.newCategoriesLimitations = [...this.categories];

    this.hideSelectedSubCategories();
    this.setStringToDisplay();
  }

  public setStringToDisplay() {
    let displayValue = "";

    if (!this.newCategoriesLimitations.length) {
      return this.translateService.instant("NO_RESTRICTION");
    }

    for (const category of this.newCategoriesLimitations) {
      displayValue = displayValue
        ? displayValue.concat(
            ", ",
            this.translateService.instant(getCategoryTranslationKey(category))
          )
        : displayValue.concat(
            this.translateService.instant(getCategoryTranslationKey(category))
          );
    }

    this.displayValue = displayValue;

    return null;
  }

  public selectCategory = (selectedCategory: Categories): void => {
    const selectedCategoryChildren =
      this.getAllPossibleChildrenRootCategory(selectedCategory);

    if (this.newCategoriesLimitations.includes(selectedCategory)) {
      this.newCategoriesLimitations.splice(
        this.newCategoriesLimitations.indexOf(selectedCategory),
        1
      );
    } else {
      for (const selectedCategoryChild of selectedCategoryChildren) {
        if (this.newCategoriesLimitations.includes(selectedCategoryChild)) {
          this.newCategoriesLimitations.splice(
            this.newCategoriesLimitations.indexOf(selectedCategoryChild),
            1
          );
        }
      }

      this.newCategoriesLimitations.push(selectedCategory);
    }

    this.setStringToDisplay();

    this.selectedCategories.emit(this.newCategoriesLimitations.sort());

    this.haveBeenTouched = true;

    this.hideSelectedSubCategories();
  };

  private hideSelectedSubCategories = () => {
    let hiddenCategories: Categories[] = [];

    for (const selectedCategory of this.newCategoriesLimitations) {
      const leaves =
        getCategoriesService().getFlatLeavesFromRootCategory(selectedCategory);

      if (leaves.length > 1) {
        hiddenCategories = hiddenCategories.concat(leaves);
      }
    }

    this.categoriesToHide = hiddenCategories;
  };

  private getAllPossibleChildrenRootCategory = (
    category: Categories
  ): Categories[] => {
    let categories: Categories[] = [];

    const categoryNode =
      getCategoriesService().getFlatCategoryTreeNode(category);

    if (categoryNode.children.length) {
      for (const childCategory of categoryNode.children) {
        categories = categories.concat(
          this.getAllPossibleChildrenRootCategory(childCategory.id)
        );
      }
    }
    categories.push(category);

    return [...new Set(categories)];
  };
}
