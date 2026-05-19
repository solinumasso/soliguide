import { Component, Input } from "@angular/core";

import { CommonPlaceEntity } from "@soliguide/common";

import { Place } from "../../../../models/place/classes";

export type EntityFieldState = "added" | "removed" | "modified" | "unchanged";

@Component({
  selector: "app-display-general-info-admin",
  templateUrl: "./display-general-info-admin.component.html",
  styleUrls: ["./display-general-info-admin.component.css"],
})
export class DisplayGeneralInfoAdminComponent {
  @Input({ required: true }) public place!: Place;
  @Input() public oldEntity: CommonPlaceEntity | undefined = undefined;
  @Input() public hideDescription = false;

  public get hasContactInfo(): boolean {
    const { phones, mail, website, facebook, fax, instagram } =
      this.place.entity;
    const old = this.oldEntity;
    return Boolean(
      phones?.length ||
        mail ||
        website ||
        facebook ||
        fax ||
        instagram ||
        old?.phones?.length ||
        old?.mail ||
        old?.website ||
        old?.facebook ||
        old?.fax ||
        old?.instagram
    );
  }

  public get phonesState(): EntityFieldState {
    const old = this.oldEntity;
    if (!old) return "unchanged";
    const oldPhones = old.phones ?? [];
    const newPhones = this.place.entity.phones ?? [];
    if (oldPhones.length === 0 && newPhones.length === 0) return "unchanged";
    if (oldPhones.length === 0 && newPhones.length > 0) return "added";
    if (oldPhones.length > 0 && newPhones.length === 0) return "removed";
    if (JSON.stringify(oldPhones) !== JSON.stringify(newPhones))
      return "modified";
    return "unchanged";
  }

  public get mailState(): EntityFieldState {
    return this.getStringFieldState(
      this.oldEntity?.mail,
      this.place.entity.mail
    );
  }

  public get websiteState(): EntityFieldState {
    return this.getStringFieldState(
      this.oldEntity?.website,
      this.place.entity.website
    );
  }

  public get faxState(): EntityFieldState {
    return this.getStringFieldState(this.oldEntity?.fax, this.place.entity.fax);
  }

  public get facebookState(): EntityFieldState {
    return this.getStringFieldState(
      this.oldEntity?.facebook,
      this.place.entity.facebook
    );
  }

  public get instagramState(): EntityFieldState {
    return this.getStringFieldState(
      this.oldEntity?.instagram,
      this.place.entity.instagram
    );
  }

  public badgeClass(state: EntityFieldState): Record<string, boolean> {
    return {
      "change-tag-added": state === "added",
      "change-tag-modified": state === "modified",
      "change-tag-deleted": state === "removed",
    };
  }

  public badgeKey(state: EntityFieldState): string {
    if (state === "added") return "CHANGE_TAG_ADDED";
    if (state === "removed") return "CHANGE_TAG_DELETED";
    return "CHANGE_TAG_MODIFIED";
  }

  public fieldClass(state: EntityFieldState): Record<string, boolean> {
    return {
      "field-added": state === "added",
      "field-modified": state === "modified",
      "field-removed": state === "removed",
    };
  }

  private getStringFieldState(
    oldValue: string | null | undefined,
    newValue: string | null | undefined
  ): EntityFieldState {
    if (!this.oldEntity) return "unchanged";
    const hasOld = Boolean(oldValue);
    const hasNew = Boolean(newValue);
    if (!hasOld && !hasNew) return "unchanged";
    if (!hasOld && hasNew) return "added";
    if (hasOld && !hasNew) return "removed";
    if (oldValue !== newValue) return "modified";
    return "unchanged";
  }
}
