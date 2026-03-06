import { Component, Input } from "@angular/core";
import { PlaceType } from "@soliguide/common";
import { Place } from "../../../../models";

@Component({
  selector: "app-display-position-admin",
  templateUrl: "./display-position-admin.component.html",
  styleUrls: ["./display-position-admin.component.css"],
})
export class DisplayPositionAdminComponent {
  public readonly PlaceType = PlaceType;
  @Input() public place!: Place;
}
