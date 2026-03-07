import { Component, Input } from "@angular/core";

import {
  ServiceSaturation,
  TempInfoType,
  Categories,
  getCategoriesSpecificFields,
} from "@soliguide/common";

import {
  CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL,
  CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED,
  Service,
  THEME_CONFIGURATION,
} from "../../../../models";
import { PosthogComponent } from "../../../analytics/components/posthog.component";
import { FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS } from "../../../../shared/constants/FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS.const";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  selector: "app-display-services",
  templateUrl: "./display-services.component.html",
  styleUrls: ["./display-services.component.css"],
})
export class DisplayServicesComponent extends PosthogComponent {
  @Input() public services!: Service[];
  @Input() public dateForTest!: Date;
  @Input() public specificField!: string;

  public readonly Categories = Categories;

  public readonly CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING =
    getCategoriesSpecificFields(THEME_CONFIGURATION.country);
  public readonly CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED =
    CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED;
  public readonly CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL =
    CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL;
  public readonly FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS =
    FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS;

  public readonly ServiceSaturation = ServiceSaturation;
  public readonly TempInfoType = TempInfoType;

  constructor(posthogService: PosthogService) {
    super(posthogService, "display-services");
  }
}
