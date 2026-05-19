import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AdminSearchPlaces } from "../../../classes";
import { UpdatedAtInterval } from "@soliguide/common";

@Component({
  selector: "app-updated-at-filter",
  templateUrl: "./updated-at-filter.component.html",
  styleUrls: ["./updated-at-filter.component.scss"],
})
export class UpdatedAtFilterComponent implements OnInit {
  @Input() public search: AdminSearchPlaces;
  @Input() public loading: boolean;
  @Output() public readonly launchSearch = new EventEmitter<void>();

  public date: Date | null = null;

  public readonly UpdatedAtInterval = UpdatedAtInterval;

  public ngOnInit() {
    if (this.search?.updatedByUserAt?.value) {
      this.date = this.search.updatedByUserAt.value;
    } else {
      this.date = null;
    }
  }

  public resetDate(): void {
    this.search.updatedByUserAt.intervalType = null;
    this.search.updatedByUserAt.value = null;
  }

  public setDate(): void {
    this.search.updatedByUserAt.value = this.date
      ? new Date(this.date.toString())
      : null;

    this.launchSearch.emit();
  }
}
