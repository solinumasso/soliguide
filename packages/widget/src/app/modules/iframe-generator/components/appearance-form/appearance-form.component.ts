import { Component, Input, OnInit } from "@angular/core";

import { IframeFormType, IframeGeneratorStep } from "../../types";

import {
  DEFAULT_WIDGET_PLACE,
  WidgetPlace,
  WidgetThemeProperties,
} from "../../../../models";

import { ThemeService } from "../../../../services/theme.service";
import { AnalyticsService } from "../../services/analytics.service";

@Component({
  selector: "app-appearance-form",
  templateUrl: "./appearance-form.component.html",
  styleUrls: ["./appearance-form.component.scss"],
})
export class AppearanceFormComponent implements OnInit {
  @Input() public formValue!: IframeFormType;

  public mockPlacesList: WidgetPlace[];

  public readonly WidgetThemeProperties = WidgetThemeProperties;

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly themeService: ThemeService
  ) {
    this.mockPlacesList = [...Array(5).keys()].map((i: number) => {
      const place = new WidgetPlace(DEFAULT_WIDGET_PLACE);
      place._id += `-${i}`;
      place.lieu_id += i;
      place.name = `${i + 1}. ${place.name}`;
      return place;
    });
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.themeService.setTheme();
    }, 100);
  }

  public setColor = async (
    colorProperty: WidgetThemeProperties
  ): Promise<void> => {
    await this.analyticsService.capture(
      "update-appearance",
      IframeGeneratorStep.APPEARANCE,
      this.formValue,
      { colorProperty }
    );
    this.themeService.setPropertyColor(
      colorProperty,
      this.formValue.theme[colorProperty]
    );
  };
}
