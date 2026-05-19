import { Component, Input, OnInit } from "@angular/core";
import {
  BabyParcelAgeType,
  DegreeOfChoiceType,
  DietaryRegimesType,
  VoucherType,
  FoodProductType,
  AvailableEquipmentType,
  getCategoriesSpecificFields,
} from "@soliguide/common";
import {
  CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE,
  CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL,
  Service,
  THEME_CONFIGURATION,
} from "../../../../models";
import { FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS } from "../../../../shared/constants/FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS.const";

@Component({
  selector: "app-display-specific-fields",
  templateUrl: "./display-specific-fields.component.html",
  styleUrls: ["./display-specific-fields.component.css"],
})
export class DisplaySpecificFieldsComponent implements OnInit {
  @Input() specificField: string;
  @Input() service: Service;

  public readonly CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING =
    getCategoriesSpecificFields(THEME_CONFIGURATION.country);
  public readonly CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE =
    CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE;
  public readonly CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL =
    CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL;
  public readonly FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS =
    FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS;

  public readonly BabyParcelAgeType = BabyParcelAgeType;
  public readonly DegreeOfChoiceType = DegreeOfChoiceType;
  public readonly DietaryRegimesType = DietaryRegimesType;
  public readonly VoucherType = VoucherType;
  public readonly FoodProductType = FoodProductType;
  public readonly AvailableEquipmentType = AvailableEquipmentType;

  public toDisplay: boolean;

  constructor() {
    this.toDisplay = false;
  }

  public ngOnInit(): void {
    this.toDisplay =
      this.service.categorySpecificFields?.[this.specificField]?.length &&
      ((this.specificField !== "degreeOfChoiceType" &&
        this.specificField !== "dietaryRegimesType" &&
        this.specificField !== "voucherTypePrecisions" &&
        this.specificField !== "otherProductTypePrecisions" &&
        this.specificField !== "availableEquipmentPrecisions") ||
        (this.specificField === "degreeOfChoiceType" &&
          (this.service.categorySpecificFields[this.specificField] ===
            DegreeOfChoiceType.ACCOMPAGNIED_CHOICE ||
            this.service.categorySpecificFields[this.specificField] ===
              DegreeOfChoiceType.FREE_CHOICE)) ||
        (this.specificField === "dietaryRegimesType" &&
          this.service.categorySpecificFields[this.specificField] ===
            DietaryRegimesType.TRY_TO_ADAPT));
  }
}
