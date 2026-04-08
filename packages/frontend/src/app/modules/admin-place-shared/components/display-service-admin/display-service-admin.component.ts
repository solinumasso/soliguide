import { Component, Input, OnInit } from "@angular/core";

import {
  Categories,
  TempInfoType,
  OpeningHours,
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
  public isCategoryExist = false;

  @Input() public service!: Service;
  @Input() public index!: number;
  @Input() public specificField!: string;
  @Input() public forceDisplayTempInfo = false;
  @Input() public oldHours?: OpeningHours | null;
  @Input() public oldService?: Service;
  @Input() public hoursAdded = false;
  @Input() public hoursChanged = false;
  @Input() public modalitiesAdded = false;
  @Input() public modalitiesChanged = false;
  @Input() public publicsAdded = false;
  @Input() public publicsChanged = false;

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

  public categoryChanged = false;
  public descriptionChanged = false;
  public specificFieldsChangeMap = new Map<
    string,
    "added" | "deleted" | "modified"
  >();

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

    this.isCategoryExist =
      !!this.service.category &&
      Object.values(Categories).includes(this.service.category);

    if (this.oldService) {
      this.categoryChanged = this.oldService.category !== this.service.category;

      const oldDesc = this.stripHtml(this.oldService.description ?? "");
      const newDesc = this.stripHtml(this.service.description ?? "");
      this.descriptionChanged = oldDesc !== newDesc;

      const oldFields = (this.oldService.categorySpecificFields ??
        {}) as Record<string, unknown>;
      const newFields = (this.service.categorySpecificFields ?? {}) as Record<
        string,
        unknown
      >;
      const allKeys = new Set([
        ...Object.keys(oldFields),
        ...Object.keys(newFields),
      ]);
      for (const key of allKeys) {
        const oldVal = oldFields[key];
        const newVal = newFields[key];
        const hasOld =
          oldVal !== null &&
          oldVal !== undefined &&
          (Array.isArray(oldVal) ? oldVal.length > 0 : true);
        const hasNew =
          newVal !== null &&
          newVal !== undefined &&
          (Array.isArray(newVal) ? newVal.length > 0 : true);
        if (JSON.stringify(oldVal ?? null) === JSON.stringify(newVal ?? null))
          continue;
        if (!hasOld && hasNew) {
          this.specificFieldsChangeMap.set(key, "added");
        } else if (hasOld && !hasNew) {
          this.specificFieldsChangeMap.set(key, "deleted");
        } else {
          this.specificFieldsChangeMap.set(key, "modified");
        }
      }
    }
  }

  private stripHtml(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent ?? div.innerText ?? "";
  }
}
