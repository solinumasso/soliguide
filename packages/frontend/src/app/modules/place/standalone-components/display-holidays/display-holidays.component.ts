import { Component, Input, OnInit } from "@angular/core";
import {
  filterDepartmentsForHolidays,
  PlaceClosedHolidays,
  PublicHoliday,
} from "@soliguide/common";
import { Search } from "../../../search/interfaces";
import { Subscription } from "rxjs";
import { HolidaysService } from "../../services/holidays.service";
import { Place } from "../../../../models";
import { CommonModule } from "@angular/common";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  selector: "app-display-holidays",
  templateUrl: "./display-holidays.component.html",
  styleUrls: ["./display-holidays.component.scss"],
})
export class DisplayHolidaysComponent implements OnInit {
  public holidays: PublicHoliday[] = [];
  private readonly subscription: Subscription = new Subscription();
  public readonly PlaceClosedHolidays = PlaceClosedHolidays;

  @Input() public search: Search;
  @Input() public place!: Place;

  constructor(private readonly holidayService: HolidaysService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.holidayService.todayHolidays.subscribe({
        next: (holidays: PublicHoliday[]) => {
          if (holidays) {
            this.holidays = filterDepartmentsForHolidays({
              holidays,
              place: this?.place,
              location: this?.search?.location,
            });
          }
        },
        error: (error) => {
          console.error("Cannot load transports", error);
        },
      })
    );
  }
}
