import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { KeyStringValueString } from "@soliguide/common";
@Component({
  selector: "app-manage-multiple-select",
  templateUrl: "./manage-multiple-select.component.html",
  styleUrls: ["./manage-multiple-select.component.css"],
})
export class ManageMultipleSelectComponent implements OnInit {
  @Input() public allOptionsLabel: string;
  @Input() public anyOptionLabel: string;
  @Input() public label: string;
  @Input() public options: string[];
  @Input() public optionLabels: KeyStringValueString;

  public allOptions: number;

  @Output() public readonly selectedOptions = new EventEmitter<string[]>();

  public ngOnInit(): void {
    this.allOptions = Object.keys(this.optionLabels).length;
  }

  public getStringToDisplay = (): string => {
    let displayValue = "";

    if (this.options?.length === this.allOptions) {
      return this.allOptionsLabel;
    } else if (!this.options || this.options.length === 0) {
      return this.anyOptionLabel;
    }

    this.options.forEach((option) => {
      if (this.options.includes(option)) {
        displayValue =
          displayValue.length !== 0
            ? displayValue.concat(", ", this.optionLabels[option])
            : displayValue.concat(this.optionLabels[option]);
      }
    });

    return displayValue;
  };

  public toggleCheckboxButton(key: string): void {
    if (key === "ALL") {
      if (this.options.length !== this.allOptions) {
        this.options = [];
        for (const option in this.optionLabels) {
          this.options.push(option);
        }
      } else {
        this.options = [];
      }
    } else {
      const index = this.options.indexOf(key);

      if (index !== -1) {
        this.options.splice(index, 1);
      } else {
        this.options.push(key);
      }
    }

    this.selectedOptions.emit(this.options);
  }
}
