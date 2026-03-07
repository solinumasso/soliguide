import { SearchPublics, SearchModalities, SearchFilterUpdatedAt } from ".";

import { AdminSearchFilterOrganization, SearchFilterClosure } from "../enums";

import {
  CampaignPlaceAutonomy,
  CampaignSource,
  CampaignStatusForSearch,
} from "../../campaign";
import {
  AnyDepartmentCode,
  GeoPosition,
  SoliguideCountries,
} from "../../location";
import { PlaceType, SearchPlaceStatus, PlaceVisibility } from "../../place";
import { SupportedLanguagesCode } from "../../translations";
import { Categories } from "../../categories";

export interface PlaceSearchForAdmin {
  category?: Categories | null;
  categories?: Categories[];
  label?: string | null;
  word?: string | null;
  openToday?: boolean;
  location: GeoPosition;
  locations?: GeoPosition[];
  publics?: SearchPublics;
  modalities?: SearchModalities;
  languages: SupportedLanguagesCode | null;
  autonomy: CampaignPlaceAutonomy[];
  campaignStatus: CampaignStatusForSearch | null;
  catToExclude: Categories[];
  lieu_id: number | null;
  organization: AdminSearchFilterOrganization | null;
  placeType: PlaceType;
  priority: boolean | null;
  sourceMaj: CampaignSource[];
  status?: SearchPlaceStatus | null;
  toCampaignUpdate: boolean;
  visibility?: PlaceVisibility | null;
  updatedAt?: SearchFilterUpdatedAt | null;
  updatedByUserAt?: SearchFilterUpdatedAt | null;
  close?: SearchFilterClosure | null;
  // TODO: create a common interface for "ManageSearch" properties, which are shared by different search classes
  country: SoliguideCountries;
  territories: AnyDepartmentCode[];
}
