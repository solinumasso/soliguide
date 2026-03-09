import { Component, Input, OnInit } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { ALL_PUBLICS, PUBLICS_LABELS, PublicsElement } from "@soliguide/common";
import { AnalyticsService } from "../../../services/analytics.service";

import { IframeFormType, IframeGeneratorStep } from "../../../types";

@Component({
  selector: "app-publics-dropdown",
  templateUrl: "./publics-dropdown.component.html",
  styleUrls: ["./publics-dropdown.component.scss"],
})
export class PublicsDropdownComponent implements OnInit {
  @Input() public label!: string;
  @Input() public prop!: PublicsElement;
  @Input() public formValue!: IframeFormType;

  public readonly ALL_PUBLICS = ALL_PUBLICS;
  public readonly PUBLICS_LABELS = PUBLICS_LABELS;

  public FILTERED_PUBLICS: { name: string; value: string }[] = [];
  public FILTERED_PUBLICS_LABELS: { [key: string]: string } = {};

  constructor(
    private readonly translateService: TranslateService,
    private readonly analyticsService: AnalyticsService
  ) {}

  public ngOnInit(): void {
    this.FILTERED_PUBLICS = this.ALL_PUBLICS[this.prop];
    this.FILTERED_PUBLICS_LABELS = this.PUBLICS_LABELS[this.prop];
  }

  public stringToDisplay = (): string => {
    let stringToReturn = "";
    if (this.formValue.publics && this.formValue.publics[this.prop]?.length) {
      if (
        (this.formValue.publics[this.prop] as string[]).length <
        this.FILTERED_PUBLICS.length - 1
      ) {
        for (const attribute of this.formValue.publics[this.prop] as string[]) {
          stringToReturn +=
            this.translateService.instant(
              this.FILTERED_PUBLICS_LABELS[attribute]
            ) + ", ";
        }
        stringToReturn = stringToReturn.slice(0, -2);
      } else {
        stringToReturn = this.translateService.instant(
          this.FILTERED_PUBLICS_LABELS["all"]
        );
      }
    } else {
      stringToReturn = this.translateService.instant("NONE");
    }
    return stringToReturn;
  };

  public toggleParameter = async (value = "") => {
    await this.analyticsService.capture(
      `toggle-${this.prop.toLowerCase()}`,
      IframeGeneratorStep.PUBLICS,
      this.formValue,
      { newValue: value }
    );

    if (!this.formValue.publics) {
      this.formValue.publics = { [this.prop]: [value] };
    } else {
      if (this.isChecked(value)) {
        const index = (this.formValue.publics[this.prop] as string[]).indexOf(
          value
        );
        this.formValue.publics[this.prop]?.splice(index, 1);
      } else {
        if (this.formValue.publics[this.prop]) {
          (this.formValue.publics[this.prop] as string[]).push(value);
        } else {
          (this.formValue.publics[this.prop] as string[]) = [value];
        }
      }
    }
  };

  public isChecked = (value: string): boolean => {
    return (this.formValue.publics &&
      this.formValue.publics[this.prop]?.length &&
      (this.formValue.publics[this.prop] as string[]).includes(
        value
      )) as boolean;
  };

  public selectAll = (): void => {
    if (!this.formValue.publics) {
      this.formValue.publics = {
        [this.prop]: this.FILTERED_PUBLICS.filter(
          (publics) => publics.value !== "all"
        ).map((publics) => publics.value),
      };
    } else if (
      this.formValue.publics?.[this.prop]?.length !==
        this.FILTERED_PUBLICS.length - 1 ||
      !this.formValue.publics[this.prop]
    ) {
      this.formValue.publics[this.prop] = this.FILTERED_PUBLICS.filter(
        (publics) => publics.value !== "all"
      ).map((publics) => publics.value as never);
    } else {
      this.formValue.publics[this.prop] = [];
    }
  };
}
