import { Component, Input } from "@angular/core";

import { Place } from "../../../../models/place/classes";

@Component({
  selector: "app-display-general-info-admin",
  templateUrl: "./display-general-info-admin.component.html",
  styleUrls: ["./display-general-info-admin.component.css"],
})
export class DisplayGeneralInfoAdminComponent {
  @Input({ required: true }) public place!: Place;
  @Input() public hideDescription = false;

  public get hasContactInfo(): boolean {
    const { phones, mail, website, facebook, fax, instagram } =
      this.place.entity;
    return !!(
      phones?.length ||
      mail ||
      website ||
      facebook ||
      fax ||
      instagram
    );
  }
}
