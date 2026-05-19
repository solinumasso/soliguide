import { Component, Input } from "@angular/core";

import { PlaceChangesStatus } from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { PlaceChangesService } from "../../services/place-changes.service";

import { PlaceChanges } from "../../../../models/place-changes";

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-check-place-changes",
  templateUrl: "./check-place-changes.component.html",
  styleUrls: ["./check-place-changes.component.css"],
})
export class CheckPlaceChangesComponent {
  @Input() public placeChanges!: PlaceChanges;
  @Input() public changeIndex!: number;

  public readonly PlaceChangesStatus = PlaceChangesStatus;
  public PlaceChangesStatusValues = Object.keys(
    PlaceChangesStatus
  ) as PlaceChangesStatus[];

  constructor(
    private readonly placeChangesService: PlaceChangesService,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService
  ) {}

  public updateStatus(placeChanges: PlaceChanges, status: PlaceChangesStatus) {
    if (status === placeChanges.status) {
      return;
    }

    this.placeChangesService.updateStatus(placeChanges._id, status).subscribe({
      next: () => {
        placeChanges.status = status;
        this.toastr.success(
          this.translateService.instant("POSITION_UPDATE_SUCCESS")
        );
      },
      error: () => {
        this.toastr.error(
          this.translateService.instant(
            "IMPOSSIBLE_TO_UPDATE_STRUCTURES_UPDATE"
          )
        );
      },
    });
  }
}
