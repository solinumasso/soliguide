import { Component, Input, OnInit } from "@angular/core";

import {
  Categories,
  TempInfoType,
  ServiceSaturation,
  getCategoriesSpecificFields,
} from "@soliguide/common";

import {
  CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED,
  CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE,
  Service,
  THEME_CONFIGURATION,
} from "../../../../models";
import { FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS } from "../../../../shared/constants/FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS.const";

@Component({
  selector: "app-display-service-admin",
  templateUrl: "./display-service-admin.component.html",
  styleUrls: ["./display-service-admin.component.css"],
})
export class DisplayServiceAdminComponent implements OnInit {
  public isCategoryExist: boolean;

  @Input() public service!: Service;
  @Input() public index!: number;
  @Input() public specificField!: string;
  @Input() public forceDisplayTempInfo = false;
  @Input() public hoursAdded = false;
  @Input() public modalitiesAdded = false;
  @Input() public publicsAdded = false;

  public readonly ServiceSaturation = ServiceSaturation;
  public readonly TempInfoType = TempInfoType;
  public readonly CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING =
    getCategoriesSpecificFields(THEME_CONFIGURATION.country);
  public readonly CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED =
    CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED;
  public readonly FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS =
    FA_ICONS_FOR_CATEGORIES_SPECIFIC_FIELDS;
  public readonly CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE =
    CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE;

  public ngOnInit(): void {
    // These fields have to be displayed only in manage
    this.CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE.forEach(
      (field) => {
        if (
          !this.CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED.body.includes(field)
        ) {
          this.CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED.body.push(field);
        }
      }
    );

    this.isCategoryExist = Object.values(Categories).includes(
      this.service.category
    );
  }
}
