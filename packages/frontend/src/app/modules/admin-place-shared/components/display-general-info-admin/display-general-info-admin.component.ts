import { Component, Input } from "@angular/core";

import { Place } from "../../../../models/place/classes";

@Component({
  selector: "app-display-general-info-admin",
  templateUrl: "./display-general-info-admin.component.html",
  styleUrls: ["./display-general-info-admin.component.css"],
})
export class DisplayGeneralInfoAdminComponent {
  @Input() public place!: Place;
  @Input() public hideDescription = false;
}
