import {
  Categories,
  LocationAutoCompleteAddress,
  SearchModalities,
  SearchPublics,
  WidgetId,
} from "@soliguide/common";

import { WidgetTheme } from "../../../models";

export type IframeFormType = {
  widgetId: WidgetId;
  cities: LocationAutoCompleteAddress[];
  departments: LocationAutoCompleteAddress[];
  regions: LocationAutoCompleteAddress[];
  national: boolean;
  categories: Categories[];
  publics?: SearchPublics;
  modalities?: SearchModalities;
  theme: WidgetTheme;
  gcu: boolean;
  email: string;
  organizationName: string;
};
