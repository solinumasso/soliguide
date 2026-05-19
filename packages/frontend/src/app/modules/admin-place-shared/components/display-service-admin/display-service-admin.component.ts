import { Component, Input, OnInit } from "@angular/core";

import {
  Categories,
  TempInfoType,
  OpeningHours,
  ServiceSaturation,
  getCategoriesSpecificFields,
} from "@soliguide/common";
import { FieldChangeStatus } from "../../enums/field-change-status.enum";

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

  public readonly FieldChangeStatus = FieldChangeStatus;

  public categoryChanged = false;
  public descriptionChanged = false;
  public specificFieldsChangeMap = new Map<string, FieldChangeStatus>();

  public ngOnInit(): void {
    this.mergeManageSpecificFields();
    this.isCategoryExist =
      !!this.service.category &&
      Object.values(Categories).includes(this.service.category);

    if (this.oldService) {
      this.computeServiceChanges(this.oldService);
    }
  }

  private mergeManageSpecificFields(): void {
    for (const field of this
      .CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE) {
      if (
        !this.CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED.body.includes(field)
      ) {
        this.CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED.body.push(field);
      }
    }
  }

  private computeServiceChanges(oldService: Service): void {
    this.categoryChanged = oldService.category !== this.service.category;

    const oldDesc = this.stripHtml(oldService.description ?? "");
    const newDesc = this.stripHtml(this.service.description ?? "");
    this.descriptionChanged = oldDesc !== newDesc;

    const oldFields = (oldService.categorySpecificFields ?? {}) as Record<
      string,
      unknown
    >;
    const newFields = (this.service.categorySpecificFields ?? {}) as Record<
      string,
      unknown
    >;
    this.computeSpecificFieldsChangeMap(oldFields, newFields);
  }

  private computeSpecificFieldsChangeMap(
    oldFields: Record<string, unknown>,
    newFields: Record<string, unknown>
  ): void {
    const allKeys = new Set([
      ...Object.keys(oldFields),
      ...Object.keys(newFields),
    ]);
    for (const key of allKeys) {
      const status = this.getFieldChangeStatus(oldFields[key], newFields[key]);
      if (status !== null) {
        this.specificFieldsChangeMap.set(key, status);
      }
    }
  }

  private getFieldChangeStatus(
    oldVal: unknown,
    newVal: unknown
  ): FieldChangeStatus | null {
    if (JSON.stringify(oldVal ?? null) === JSON.stringify(newVal ?? null)) {
      return null;
    }
    const hasOld = this.hasValue(oldVal);
    const hasNew = this.hasValue(newVal);
    if (!hasOld && hasNew) return FieldChangeStatus.ADDED;
    if (hasOld && !hasNew) return FieldChangeStatus.DELETED;
    return FieldChangeStatus.MODIFIED;
  }

  private hasValue(val: unknown): boolean {
    return (
      val !== null &&
      val !== undefined &&
      (!Array.isArray(val) || val.length > 0)
    );
  }

  private stripHtml(html: string): string {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent ?? div.innerText ?? "";
  }
}
