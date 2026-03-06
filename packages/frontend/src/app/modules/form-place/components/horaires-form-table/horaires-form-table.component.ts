import { Component, EventEmitter, Input, Output } from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import {
  CommonTimeslot,
  DayName,
  OpeningHoursContext,
  WEEK_DAYS,
  formatStringTime,
  OpeningHours,
} from "@soliguide/common";

@Component({
  selector: "app-form-table-horaires",
  templateUrl: "./horaires-form-table.component.html",
  styleUrls: ["./horaires-form-table.component.scss"],
})
export class HorairesFormTableComponent {
  @Input() public hours!: OpeningHours;
  @Output() public readonly hoursChange = new EventEmitter<OpeningHours>();

  @Input() public index: number;

  public readonly WEEK_DAYS = WEEK_DAYS;

  public isCorrect: boolean;

  constructor(
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService
  ) {}

  public deleteSlot(day: DayName, index: number): void {
    this.hours[day].timeslot.splice(index, 1);
    this.hours[day].open = this.hours[day].timeslot.length > 0;
    this.updateHours();
  }

  public newSlot(day: string): void {
    if (this.hours[day].timeslot.length >= 2) {
      this.toastr.warning(
        this.translateService.instant("ONLY_ADD_THREE_TIME_SLOTS")
      );
    }

    if (this.hours[day].timeslot.length === 0) {
      let lastSetDay = null;

      for (const dayLoop of WEEK_DAYS) {
        if (day === dayLoop) {
          break;
        }

        if (this.hours[dayLoop].timeslot.length !== 0) {
          lastSetDay = dayLoop;
        }
      }

      if (lastSetDay !== null) {
        for (const timeslot of this.hours[lastSetDay].timeslot) {
          this.hours[day].timeslot.push(
            new CommonTimeslot(
              {
                end: formatStringTime(timeslot.end),
                start: formatStringTime(timeslot.start),
              },
              OpeningHoursContext.ADMIN
            )
          );
          this.hours[day].open = true;
        }
      } else {
        this.hours[day].timeslot.push(
          new CommonTimeslot(
            {
              start: 800,
              end: 1700,
            },
            OpeningHoursContext.ADMIN
          )
        );
        this.hours[day].open = true;
      }
    } else {
      this.hours[day].timeslot.push(
        new CommonTimeslot(
          {
            start: 800,
            end: 1700,
          },
          OpeningHoursContext.ADMIN
        )
      );
      this.hours[day].open = true;
    }

    this.updateHours();
  }

  public updateHours() {
    if (this.hoursChange) {
      this.hoursChange.emit(this.hours);
    }
  }
}
