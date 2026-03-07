import {
  SupportedLanguagesCode,
  Categories,
  GeoPosition,
  PlaceType,
  SearchFilterUpdatedAt,
  SearchModalities,
  SearchPublics,
  ManageSearchOptions,
  AutoCompleteType,
} from "@soliguide/common";

import { UserForLogs } from "../../_models";

export interface LogSearchPlaces {
  _id?: string;
  adminSearch?: boolean;
  category: Categories | null;
  categories?: Categories[];
  languages: SupportedLanguagesCode;
  location: GeoPosition;
  modalities: SearchModalities;
  nbResults: number;
  openToday?: boolean;
  options: ManageSearchOptions;
  placeType?: PlaceType;
  publics: SearchPublics;
  user?: UserForLogs;
  userData: UserForLogs;
  word: string | null;
  updatedAt?: SearchFilterUpdatedAt;
  suggestionType: AutoCompleteType | "EMPTY";
  slug?: string | null;
}
