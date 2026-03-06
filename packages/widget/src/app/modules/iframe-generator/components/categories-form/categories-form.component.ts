import { Component, Input } from "@angular/core";

import { WIDGET_CATEGORIES } from "../../constants";
import { AnalyticsService } from "../../services/analytics.service";
import { IframeFormType, IframeGeneratorStep } from "../../types";

@Component({
  selector: "app-categories-form",
  templateUrl: "./categories-form.component.html",
  styleUrls: ["./categories-form.component.scss"],
})
export class CategoriesFormComponent {
  @Input() public formValue!: IframeFormType;

  public readonly WIDGET_CATEGORIES = WIDGET_CATEGORIES;

  constructor(private readonly analyticsService: AnalyticsService) {}

  public toggleCategory = async (selectedCategory: string) => {
    await this.analyticsService.capture(
      "toggle-category",
      IframeGeneratorStep.CATEGORIES,
      this.formValue,
      { selectedCategory }
    );
    if (this.hasCategory(selectedCategory)) {
      const updatedCategories = this.formValue.categories.filter(
        (category) =>
          !this.WIDGET_CATEGORIES[selectedCategory].categories.includes(
            category
          )
      );
      this.formValue.categories = updatedCategories;
    } else {
      for (const category of this.WIDGET_CATEGORIES[selectedCategory]
        .categories) {
        this.formValue.categories.push(category);
      }
    }
  };

  public hasCategory = (selectedCategory: string): boolean => {
    return this.WIDGET_CATEGORIES[selectedCategory].categories.every(
      (category) => this.formValue.categories.includes(category)
    );
  };
}
