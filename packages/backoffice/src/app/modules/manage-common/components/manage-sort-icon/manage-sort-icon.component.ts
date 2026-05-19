import { Component, Input } from "@angular/core";

import {
  faArrowDown,
  faArrowUp,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

import { ManageSearchOptions, SortingOrder } from "@soliguide/common";

@Component({
  selector: "app-manage-sort-icon",
  templateUrl: "./manage-sort-icon.component.html",
  styleUrls: ["./manage-sort-icon.component.css"],
})
export class ManageSortIconComponent {
  public readonly faArrowDown = faArrowDown;
  public readonly faArrowUp = faArrowUp;
  public readonly faSort = faSort;

  public readonly SortingOrder = SortingOrder;

  @Input() public options: ManageSearchOptions;
  @Input() public searchField: string;
  @Input() public columnName: string;
}
