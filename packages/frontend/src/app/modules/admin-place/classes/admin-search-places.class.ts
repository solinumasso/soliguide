/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  type AdminSearchFilterOrganization,
  type CampaignPlaceAutonomy,
  type CampaignSource,
  type CampaignStatusForSearch,
  type Categories,
  type PlaceSearchForAdmin,
  PlaceType,
  type PlaceVisibility,
  type SearchFilterClosure,
  type SearchFilterUpdatedAt,
  type SearchModalities,
  type SearchPlaceStatus,
  type SearchPublics,
  type SupportedLanguagesCode,
  COUNTRIES_LOCATION,
  type LocationAutoCompleteAddress,
  GeoPosition,
  AutoCompleteType,
  SearchSuggestion,
} from "@soliguide/common";

import { THEME_CONFIGURATION } from "../../../models";
import type { User } from "../../users/classes";
import { ManageSearch } from "../../manage-common/classes";

export class AdminSearchPlaces
  extends ManageSearch
  implements PlaceSearchForAdmin
{
  public category?: Categories;
  public categories?: Categories[];
  public openToday: boolean;

  public label: string | null;
  public word: string | null;

  public location: GeoPosition;
  public locations: GeoPosition[];
  public publics?: SearchPublics;
  public modalities?: SearchModalities;

  public languages: SupportedLanguagesCode | null;

  public autonomy: CampaignPlaceAutonomy[];
  public campaignStatus: CampaignStatusForSearch | null;
  public catToExclude: Categories[];
  public lieu_id: number | null;
  public organization: AdminSearchFilterOrganization | null;
  public placeType: PlaceType;
  public priority: boolean | null;
  public sourceMaj: CampaignSource[];
  public status: SearchPlaceStatus | null;
  public toCampaignUpdate: boolean;
  public visibility: PlaceVisibility | null;
  public updatedByUserAt: SearchFilterUpdatedAt;
  public close: SearchFilterClosure | null;

  constructor(data: Partial<PlaceSearchForAdmin>, user: User) {
    super(data, user);
    this.category = null;

    this.label = null;
    this.word = null;

    const defaultLocation = COUNTRIES_LOCATION.find(
      (position: LocationAutoCompleteAddress) =>
        position.country === THEME_CONFIGURATION.country
    );

    this.location = new GeoPosition(defaultLocation);

    this.locations = [];
    this.publics = undefined;
    this.modalities = undefined;

    this.languages = null;

    this.autonomy = [];
    this.campaignStatus = null;
    this.catToExclude = [];
    this.lieu_id = null;
    this.organization = null;
    this.placeType = PlaceType.PLACE;
    this.priority = null;
    this.sourceMaj = [];
    this.status = null;
    this.toCampaignUpdate = null;
    this.visibility = null;
    this.updatedByUserAt = {
      intervalType: null,
      value: null,
    };

    this.close = null;

    if (data) {
      this.label = data.label ?? null;
      this.word = data.word ?? null;

      this.location = data.location
        ? { ...this.location, ...data.location }
        : this.location;

      this.publics = data.publics ?? undefined;
      this.modalities = data.modalities ?? undefined;

      this.languages = data.languages ?? null;

      this.autonomy = data.autonomy ?? [];
      this.campaignStatus = data.campaignStatus ?? null;
      this.catToExclude = data.catToExclude
        ? [...new Set<Categories>(data.catToExclude)]
        : [];
      this.lieu_id = data.lieu_id ?? null;
      this.organization = data.organization ?? null;
      this.placeType = data.placeType ?? PlaceType.PLACE;
      this.priority = data.priority ?? null;
      this.sourceMaj = data.sourceMaj ?? [];
      this.status = data.status ?? null;
      this.toCampaignUpdate = data.toCampaignUpdate ?? null;
      this.visibility = data.visibility ?? null;
      this.updatedByUserAt = data.updatedByUserAt ?? {
        intervalType: null,
        value: null,
      };
      this.close = data.close ?? null;

      if (data.category) {
        this.category = data.category;

        this.word = null;
      } else {
        this.category = null;
      }
    }
  }

  public resetSearchTerms(): void {
    this.category = null;
    this.word = null;
    this.label = null;
  }

  public setCategory(categoryId: Categories, label?: string): void {
    this.category = categoryId;
    this.word = null;
    if (label) {
      this.label = label;
    }
  }

  public setWord(word: string, label?: string): void {
    this.word = word;
    this.category = null;
    if (label) {
      this.label = label;
    }
  }
  public applySearchSuggestion(suggestion: SearchSuggestion): void {
    this.resetSearchTerms();

    if (suggestion.type === AutoCompleteType.CATEGORY) {
      this.category = suggestion.categoryId;
    } else {
      this.word = suggestion.slug;
      this.label = suggestion.label;
    }
  }
}
