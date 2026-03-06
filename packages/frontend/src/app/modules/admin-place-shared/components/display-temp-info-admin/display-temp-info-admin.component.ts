import { Component, Input, OnInit } from "@angular/core";

import { TempInfo, TempInfoType, OpeningHours } from "@soliguide/common";

import { DateService } from "../../../place/services/date.service";

@Component({
  selector: "app-display-temp-info-admin",
  templateUrl: "./display-temp-info-admin.component.html",
  styleUrls: ["./display-temp-info-admin.component.css"],
})
export class DisplayTempInfoAdminComponent implements OnInit {
  @Input() public tempInfo!: TempInfo;

  public openingHours?: OpeningHours;

  public readonly TempInfoType = TempInfoType;

  public dateString: string;

  constructor(private readonly dateService: DateService) {
    this.dateString = "";
  }

  public ngOnInit(): void {
    this.dateString = this.dateService
      .translateDateInterval(this.tempInfo.dateDebut, this.tempInfo.dateFin)
      .toLowerCase();

    if (this.tempInfo.tempInfoType === TempInfoType.HOURS) {
      this.openingHours = new OpeningHours(this.tempInfo.hours, true);
    }
  }
}
