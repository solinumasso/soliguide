import { Component, Input, OnInit } from "@angular/core";
import { PlaceType } from "@soliguide/common";
import { Place } from "../../../../models";
import { FieldChangeStatus } from "../../enums/field-change-status.enum";

@Component({
  selector: "app-display-position-admin",
  templateUrl: "./display-position-admin.component.html",
  styleUrls: ["./display-position-admin.component.css"],
})
export class DisplayPositionAdminComponent implements OnInit {
  public readonly PlaceType = PlaceType;
  public readonly FieldChangeStatus = FieldChangeStatus;

  @Input({ required: true }) public place!: Place;
  @Input() public oldPlace?: Place;

  public addressChangeType: FieldChangeStatus | null = null;
  public additionalInfoChangeType: FieldChangeStatus | null = null;

  public ngOnInit(): void {
    if (!this.oldPlace) return;

    const oldAddress = this.oldPlace.position?.address ?? "";
    const newAddress = this.place.position?.address ?? "";
    if (oldAddress !== newAddress) {
      this.addressChangeType = oldAddress
        ? FieldChangeStatus.MODIFIED
        : FieldChangeStatus.ADDED;
    }

    const oldInfo = this.oldPlace.position?.additionalInformation ?? "";
    const newInfo = this.place.position?.additionalInformation ?? "";
    if (oldInfo !== newInfo) {
      if (!oldInfo && newInfo)
        this.additionalInfoChangeType = FieldChangeStatus.ADDED;
      else if (oldInfo && !newInfo)
        this.additionalInfoChangeType = FieldChangeStatus.DELETED;
      else this.additionalInfoChangeType = FieldChangeStatus.MODIFIED;
    }
  }
}
