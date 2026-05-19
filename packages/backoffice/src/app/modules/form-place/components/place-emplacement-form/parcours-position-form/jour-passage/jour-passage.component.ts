import { Component, Input } from "@angular/core";
import { DayName, WEEK_DAYS } from "@soliguide/common";

@Component({
  selector: "app-jour-passage",
  templateUrl: "./jour-passage.component.html",
  styleUrls: ["./jour-passage.component.css"],
})
export class JourPassageFormComponent {
  @Input() public openingDays: string[] = [];

  public readonly WEEK_DAYS = WEEK_DAYS;

  public toogleDay = (day: string) => {
    const index = this.openingDays.indexOf(day as DayName);
    if (index > -1) {
      this.openingDays.splice(index, 1);
    } else {
      this.openingDays.push(day as DayName);
    }
  };
}
