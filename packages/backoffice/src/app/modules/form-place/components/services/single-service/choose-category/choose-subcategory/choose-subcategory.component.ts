import { Component, Input } from "@angular/core";

import {
  Service,
  CATEGORIES_SPECIFIC_FIELDS_ENUM_VALUES,
  CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL,
  THEME_CONFIGURATION,
} from "../../../../../../../models";

@Component({
  selector: "app-form-choose-subcategory",
  templateUrl: "./choose-subcategory.component.html",
  styleUrls: ["./choose-subcategory.component.css"],
})
export class FormChooseSubCategoryComponent {
  @Input() public service: Service;
  @Input() public serviceIndex: number;
  @Input() public categorySpecificField: string;

  public readonly CATEGORIES_SPECIFIC_FIELDS_ENUM_VALUES =
    CATEGORIES_SPECIFIC_FIELDS_ENUM_VALUES;
  public readonly CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL =
    CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
}
