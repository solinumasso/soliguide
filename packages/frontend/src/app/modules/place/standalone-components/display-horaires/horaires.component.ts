import { Component, Input, OnInit } from "@angular/core";
import { DayName, WEEK_DAYS, OpeningHours } from "@soliguide/common";
import { weekDaysOrdering } from "../../../../shared/functions";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, TranslatePipe, NgbTooltip],
  selector: "app-display-horaires",
  styleUrls: ["./horaires.component.css"],
  templateUrl: "./horaires.component.html",
})
export class DisplayHorairesComponent implements OnInit {
  @Input() public hours!: OpeningHours | null;
  @Input() public oldHours?: OpeningHours | null;
  @Input() public displayClosedDays!: boolean;
  @Input() public isPlace = true;
  @Input() public daysMustBeOrdered?: boolean;
  @Input() public isTempClosed = false;
  @Input() public isPartiallyOpen = false;

  public weekDays: DayName[];
  public indexToday: number;
  public dayToday: DayName;
  public changedDays = new Set<DayName>();

  ngOnInit(): void {
    this.indexToday = (new Date().getDay() + 6) % 7;
    this.dayToday = WEEK_DAYS[this.indexToday];
    if (this.daysMustBeOrdered) {
      this.weekDays = weekDaysOrdering(WEEK_DAYS, this.indexToday);
    } else {
      this.weekDays = WEEK_DAYS;
    }

    if (this.oldHours && this.hours) {
      for (const day of WEEK_DAYS) {
        const oldDay = this.oldHours[day];
        const newDay = this.hours[day];
        if (
          oldDay?.open !== newDay?.open ||
          JSON.stringify(oldDay?.timeslot) !== JSON.stringify(newDay?.timeslot)
        ) {
          this.changedDays.add(day);
        }
      }
    }
  }
}
