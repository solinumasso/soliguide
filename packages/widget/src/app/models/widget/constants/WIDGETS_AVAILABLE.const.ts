import { WidgetId } from "@soliguide/common";
import { WidgetThemeName } from "../enums";
import { WidgetTheme } from "../types";

export const WIDGETS: {
  [key in WidgetId]: {
    name: string;
    themeName: WidgetThemeName;
    theme: WidgetTheme;
  };
} = {
  CRF: {
    name: "Croix-Rouge française",
    themeName: WidgetThemeName.CRF,
    theme: {
      "bs-primary": "#e30614",
      "bs-primary-dark": "#be0511",
      "bs-primary-light": "#fce7e8",
      "bs-secondary": "#942615",
      "text-primary": "#e30614",
    },
  },
  SAMU_SOCIAL: {
    name: "Samu Social",
    themeName: WidgetThemeName.SAMU_SOCIAL,
    theme: {
      "bs-primary": "#0C469C",
      "bs-primary-dark": "#062655",
      "bs-primary-light": "#9cb7df",
      "bs-secondary": "#FFC800",
      "text-primary": "#0C469C",
    },
  },
  SOLINUM: {
    name: "Solinum",
    themeName: WidgetThemeName.SOLINUM,
    theme: {
      "bs-primary": "#3e3a71",
      "bs-primary-dark": "#22203F",
      "bs-primary-light": "#cdcae9",
      "bs-secondary": "#e65a46",
      "text-primary": "#3e3a71",
    },
  },
};
