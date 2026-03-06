import { Component, EventEmitter, Input, Output } from "@angular/core";

import {
  AvailableEquipmentType,
  Categories,
  DietaryRegimesType,
  getCategoriesService,
  getCategoriesSpecificFields,
  VoucherType,
} from "@soliguide/common";

import {
  Service,
  CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE,
  CATEGORIES_SPECIFIC_FIELDS_PLACEHOLDER,
  CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL,
  THEME_CONFIGURATION,
} from "../../../../../../models";
import { FoodProductType } from "@soliguide/common";

@Component({
  selector: "app-form-choose-category-fiche",
  templateUrl: "./choose-category.component.html",
  styleUrls: ["./choose-category.component.css"],
})
export class FormChooseCategoryFicheComponent {
  @Input() public service: Service;
  @Input() public serviceIndex: number;

  public readonly CATEGORIES_NODES_WITH_ONE_DEPTH_CHILDREN =
    getCategoriesService().geCategoriesNodesWithOneDepthChildren();
  public readonly CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING =
    getCategoriesSpecificFields(THEME_CONFIGURATION.country);
  public readonly CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE =
    CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE;
  public readonly CATEGORIES_SPECIFIC_FIELDS_PLACEHOLDER =
    CATEGORIES_SPECIFIC_FIELDS_PLACEHOLDER;
  public readonly CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL =
    CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL;

  @Output() public readonly noCategory = new EventEmitter<boolean>();

  public generateSortedArray = (from: number, to: number): number[] => {
    const n = to - from + 1;
    return [...Array(n).keys()].map((i) => i + from);
  };

  public updateCategory = (category: Categories): void => {
    if (this.CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[category]) {
      const newCategorySpecificFields = {};

      for (const specificField of this
        .CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[category]) {
        if (this.service.categorySpecificFields?.[specificField]) {
          newCategorySpecificFields[specificField] =
            this.service.categorySpecificFields?.[specificField];
        }
      }

      this.service.categorySpecificFields = newCategorySpecificFields;
    } else {
      delete this.service.categorySpecificFields;
    }
    this.service.category = category;
  };

  public updateCategorySpecificField = (
    categorySpecificFieldValue: string,
    categorySpecificField: string
  ): void => {
    this.service.categorySpecificFields[categorySpecificField] =
      categorySpecificFieldValue;
  };

  public displayTextareaForm(categorySpecificField: string): boolean {
    return !!(
      CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE.textarea.includes(
        categorySpecificField
      ) &&
      ((categorySpecificField !== "voucherTypePrecisions" &&
        categorySpecificField !== "otherProductTypePrecisions" &&
        categorySpecificField !== "availableEquipmentPrecisions") ||
        (categorySpecificField === "voucherTypePrecisions" &&
          this.service.categorySpecificFields?.voucherType ===
            VoucherType.OTHER) ||
        (categorySpecificField === "otherProductTypePrecisions" &&
          this.service.categorySpecificFields?.foodProductType.includes(
            FoodProductType.OTHER
          )) ||
        (categorySpecificField === "availableEquipmentPrecisions" &&
          this.service.categorySpecificFields?.availableEquipmentType?.includes(
            AvailableEquipmentType.OTHER
          )))
    );
  }

  public displayChecklistForm = (categorySpecificField: string): boolean => {
    return !!(
      CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE.checklist.includes(
        categorySpecificField
      ) &&
      (categorySpecificField !== "dietaryAdaptationsType" ||
        (categorySpecificField === "dietaryAdaptationsType" &&
          this.service.categorySpecificFields?.dietaryRegimesType ===
            DietaryRegimesType.WE_ADAPT))
    );
  };
}
