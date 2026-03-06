import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { SearchFilterParams } from "../../interfaces";

@Component({
  selector: "app-temp-open-filter",
  templateUrl: "./temp-open-filter.component.html",
  styleUrls: [
    "./temp-open-filter.component.css",
    "../search/search.component.scss",
  ],
})
export class TempOpenFilterComponent implements OnInit {
  @Input({ required: true }) public filters: SearchFilterParams;

  public openTodayChecked: boolean;

  @Output() public readonly filtersChange = new EventEmitter<void>();

  public ngOnInit(): void {
    this.openTodayChecked = !!this.filters.openToday;
  }

  public emitFilters = () => {
    this.openTodayChecked = !this.openTodayChecked;
    this.filtersChange.emit();
  };
}
