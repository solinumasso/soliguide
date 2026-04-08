import { Component, Input, OnInit } from "@angular/core";
import { PlaceType } from "@soliguide/common";
import { Place } from "../../../../models";

@Component({
  selector: "app-display-position-admin",
  templateUrl: "./display-position-admin.component.html",
  styleUrls: ["./display-position-admin.component.css"],
})
export class DisplayPositionAdminComponent implements OnInit {
  public readonly PlaceType = PlaceType;
  @Input() public place!: Place;
  @Input() public oldPlace?: Place;

  public addressChangeType: "added" | "modified" | null = null;
  public additionalInfoChangeType: "added" | "modified" | "deleted" | null =
    null;

  public ngOnInit(): void {
    if (!this.oldPlace) return;

    const oldAddress = this.oldPlace.position?.address ?? "";
    const newAddress = this.place.position?.address ?? "";
    if (oldAddress !== newAddress) {
      this.addressChangeType = oldAddress ? "modified" : "added";
    }

    const oldInfo = this.oldPlace.position?.additionalInformation ?? "";
    const newInfo = this.place.position?.additionalInformation ?? "";
    if (oldInfo !== newInfo) {
      if (!oldInfo && newInfo) this.additionalInfoChangeType = "added";
      else if (oldInfo && !newInfo) this.additionalInfoChangeType = "deleted";
      else this.additionalInfoChangeType = "modified";
    }
  }
}
