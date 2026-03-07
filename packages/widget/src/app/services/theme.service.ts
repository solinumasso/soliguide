import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

import { WidgetId } from "@soliguide/common";

import { WIDGETS, WidgetThemeProperties } from "../models";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  public widgetId: WidgetId;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.widgetId = WidgetId.SOLINUM;
  }

  public setWidgetId = (widgetId: WidgetId): void => {
    this.widgetId = widgetId;
    this.setTheme();
  };

  public setTheme = (): void => {
    const theme = WIDGETS[this.widgetId].theme;

    Object.keys(theme).forEach((content: unknown) => {
      const key = content as WidgetThemeProperties;

      this.setPropertyColor(key, theme[key]);
    });
  };

  public setPropertyColor = (
    property: WidgetThemeProperties,
    color: string
  ): void => {
    if (color) {
      let selectedColor = color;

      if (!/^#[A-Fa-f0-9]{6}$/.test(color)) {
        selectedColor = WIDGETS[this.widgetId].theme[property];
      }

      const customizableElements =
        this.document.getElementsByClassName("customizable");

      Array.prototype.forEach.call(
        customizableElements,
        (element: HTMLElement) => {
          element.style.setProperty(`--${property}`, selectedColor);
        }
      );
    }
  };
}
