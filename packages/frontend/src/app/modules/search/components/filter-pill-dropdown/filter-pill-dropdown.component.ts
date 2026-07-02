import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from "@angular/core";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";

import { SharedModule } from "../../../shared/shared.module";

export interface FilterPillOption {
  value: string;
  label: string;
}

@Component({
  selector: "app-filter-pill-dropdown",
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    NgbDropdownModule,
    TranslateModule,
    SharedModule,
  ],
  templateUrl: "./filter-pill-dropdown.component.html",
  styleUrls: ["./filter-pill-dropdown.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class FilterPillDropdownComponent {
  @Input({ required: true }) public label!: string;
  @Input({ required: true }) public allLabel!: string;
  @Input({ required: true }) public options!: FilterPillOption[];
  @Input() public value: string | null = null;
  @Input() public name = "filter";
  @Input() public icon: string | null = null;

  @Output() public readonly valueChange = new EventEmitter<string | null>();

  public get selectedOption(): FilterPillOption | undefined {
    return this.value
      ? this.options.find((option) => option.value === this.value)
      : undefined;
  }

  public select(value: string | null): void {
    this.valueChange.emit(value);
  }
}
