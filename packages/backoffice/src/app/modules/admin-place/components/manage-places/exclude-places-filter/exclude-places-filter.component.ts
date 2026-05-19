import { TranslateService } from "@ngx-translate/core";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  Categories,
  DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION,
  getCategoryTranslationKey,
} from "@soliguide/common";

@Component({
  selector: "app-exclude-places-filter",
  templateUrl: "./exclude-places-filter.component.html",
  styleUrls: ["./exclude-places-filter.component.css"],
})
export class ExcludePlacesFilterComponent implements OnInit {
  @Input() public categoriesToExclude: Categories[];

  public readonly DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION =
    DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION;

  @Output() public readonly selectedCatToExclude = new EventEmitter<
    Categories[]
  >();

  public constructor(private readonly translateService: TranslateService) {
    this.categoriesToExclude = [];
  }

  public ngOnInit(): void {
    if (!this.categoriesToExclude) {
      this.categoriesToExclude = [];
    }
  }

  public getStringToDisplay(): string {
    let displayValue = "";

    if (this.categoriesToExclude.length === 0) {
      return this.translateService.instant("NO_CATEGORY");
    }

    this.categoriesToExclude.forEach((category) => {
      const label = this.translateService.instant(
        getCategoryTranslationKey(category)
      );

      if (this.categoriesToExclude.includes(category)) {
        displayValue =
          displayValue.length !== 0
            ? displayValue.concat(", ", label)
            : displayValue.concat(label);
      }
    });

    return displayValue;
  }

  public toggleCheckboxButton(key: Categories): void {
    const index = this.categoriesToExclude.indexOf(key);

    if (index !== -1) {
      this.categoriesToExclude.splice(index, 1);
    } else {
      this.categoriesToExclude.push(key);
    }
    this.selectedCatToExclude.emit(this.categoriesToExclude);
  }
}
