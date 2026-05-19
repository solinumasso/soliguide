import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ManageSearchOptions } from "@soliguide/common";

@Component({
  selector: "app-manage-pagination",
  templateUrl: "./manage-pagination.component.html",
  styleUrls: ["./manage-pagination.component.css"],
})
export class ManagePaginationComponent {
  @Input() public nbResults = 0;
  @Output() public readonly launchSearch = new EventEmitter<void>();

  @Input() public options: ManageSearchOptions;
  @Output() public readonly optionsChange =
    new EventEmitter<ManageSearchOptions>();

  public updateOptions() {
    this.launchSearch.emit();
    this.optionsChange.emit(this.options);
  }
}
