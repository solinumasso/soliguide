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
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  type TemplateRef,
  ViewChild,
} from "@angular/core";
import { Title } from "@angular/platform-browser";

import { NgbModal, type NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ReplaySubject, type Subject, Subscription } from "rxjs";

import {
  AdminSearchFilterOrganization,
  CAMPAIGN_DEFAULT_NAME,
  PLACE_AUTONOMY_LABELS,
  CampaignPlaceAutonomy,
  type CampaignSource,
  CampaignStatus,
  GeoPosition,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  PublicsOther,
  SearchPlaceStatus,
  getDepartmentCodeFromPostalCode,
  type LocationAutoCompleteAddress,
  type Categories,
  getDefaultSearchRadiusByGeoType,
  CountryCodes,
  LocationAreas,
  ManageSearchOptions,
} from "@soliguide/common";

import { AdminSearchPlaces } from "../../classes";
import { ManagePlacesService } from "../../services/manage-places.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import type { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import {
  CAMPAIGN_LIST,
  CAMPAIGN_SOURCE_LABELS,
  ORGA_CAMPAIGN_STATUS,
  PLACE_CAMPAIGN_STATUS,
  type Place,
  type SearchResults,
  THEME_CONFIGURATION,
} from "../../../../models";

import {
  fadeInOut,
  campaignIsActive,
  globalConstants,
  DEFAULT_MODAL_OPTIONS,
} from "../../../../shared";

const LOCAL_STORAGE_KEY = "SOLIGUIDE_MANAGE_PLACES_SEARCH";
@Component({
  animations: [fadeInOut],
  selector: "app-admin-search-places",
  templateUrl: "./manage-places.component.html",
  styleUrls: ["./manage-places.component.css"],
})
export class ManagePlacesComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  // Results
  public me!: User | null;
  public places: Place[];
  public selectedPlace: Place | null;
  public hasFilter: boolean;

  // Search
  public nbResults: number;
  public loading: boolean;

  // Search elements
  public search: AdminSearchPlaces;
  public searchSubject: Subject<AdminSearchPlaces> = new ReplaySubject(1);

  // Filters
  public showFilters: boolean;
  public autoExportLoading: boolean;

  // TODO: isolate in a component
  @ViewChild("deletePlaceModal", { static: true })
  public deletePlaceModal!: TemplateRef<NgbModalRef>;

  public campaignIsActiveForMe: boolean;

  // Campaign
  public readonly CAMPAIGN_DEFAULT_NAME = CAMPAIGN_DEFAULT_NAME;
  public readonly CAMPAIGN_DESCRIPTION =
    CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].description;
  public readonly CAMPAIGN_NAME = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].name;
  public readonly CAMPAIGN_SOURCE_LABELS = CAMPAIGN_SOURCE_LABELS;

  public readonly ORGA_CAMPAIGN_STATUS = ORGA_CAMPAIGN_STATUS;

  public readonly PLACE_CAMPAIGN_STATUS = PLACE_CAMPAIGN_STATUS;
  public readonly PLACE_AUTONOMY_LABELS = PLACE_AUTONOMY_LABELS;

  public readonly CampaignPlaceAutonomy = CampaignPlaceAutonomy;

  public readonly SEARCH_PLACE_STATUS = Object.keys(SearchPlaceStatus);
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  public readonly PlaceStatus = PlaceStatus;
  public readonly PlaceVisibility = PlaceVisibility;
  public readonly PublicsOther = PublicsOther;
  public readonly AdminSearchFilterOrganization = AdminSearchFilterOrganization;
  public readonly PlaceType = PlaceType;
  public readonly SearchPlaceStatus = SearchPlaceStatus;
  public readonly CampaignStatus = CampaignStatus;
  public readonly ManagePlacesComponent = ManagePlacesComponent;

  public routePrefix: string;

  constructor(
    private readonly authService: AuthService,
    private readonly managePlacesService: ManagePlacesService,
    private readonly modalService: NgbModal,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly cdf: ChangeDetectorRef,
    private readonly translateService: TranslateService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.loading = true;
    this.places = [];
    this.hasFilter = false;

    this.nbResults = 0;

    this.autoExportLoading = false;
    this.selectedPlace = null;
    this.campaignIsActiveForMe = false;
    this.showFilters = true;

    this.routePrefix = this.currentLanguageService.routePrefix;

    // Get user's data in order to initialize the search in a suitable manner
    this.me = this.authService.currentUserValue;

    this.search = new AdminSearchPlaces({}, this.me);
  }

  public toggleFilter = (): void => {
    this.showFilters = !this.showFilters;
    globalConstants.setItem("HIDE_FILTERS", this.showFilters);
  };

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.campaignIsActiveForMe = campaignIsActive(this.me?.territories);
    this.titleService.setTitle(
      this.translateService.instant("MANAGE_STRUCTURES")
    );

    const lastSearch = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lastSearch) {
      this.search = new AdminSearchPlaces(JSON.parse(lastSearch), this.me);
    } else {
      this.search = new AdminSearchPlaces(null, this.me);
    }

    this.searchSubject.next(this.search);
    this.searchSubject.subscribe({
      next: (search: AdminSearchPlaces) => {
        this.loading = true;
        window.scroll({
          left: 0,
          top: 0,
        });

        globalConstants.setItem("MANAGE_PLACES", this.search);

        this.subscription.add(
          this.managePlacesService
            .launchSearch(search, "admin-search")
            .subscribe({
              next: (response: SearchResults) => {
                this.places = response.places;
                this.nbResults = response.nbResults;
                this.loading = false;
                this.hasFilter = this.getHasFilter();
                this.cdf.detectChanges();
              },
              error: () => {
                this.toastr.error(
                  this.translateService.instant("SEARCH_ERROR")
                );
              },
            })
        );
      },
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public resetSearchArgument = (key: string): void => {
    this.search.resetSearchElement(key);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.search));
    this.launchSearch();
  };

  public launchSearch = (resetPagination?: boolean): void => {
    if (resetPagination) {
      this.search.options.page = 1;
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.search));
    this.searchSubject.next(this.search);
  };

  public updateLocation = (item: LocationAutoCompleteAddress): void => {
    const searchPosition = new GeoPosition({
      ...item,
      distance: getDefaultSearchRadiusByGeoType(item.geoType),
    });
    this.search.location = searchPosition;
    this.search.options.page = 1;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.search));
    this.searchSubject.next(this.search);
  };

  public sortBy = (value: string): void => {
    this.search.sort(this.search.options, value);
    this.launchSearch();
  };

  // Modals
  public openPlaceModal = (
    content: TemplateRef<NgbModalRef>,
    place: Place
  ): void => {
    this.selectedPlace = place;
    this.modalService.open(content, DEFAULT_MODAL_OPTIONS);
  };

  public openModal = (templateRef: TemplateRef<unknown>) => {
    return this.modalService.open(templateRef, DEFAULT_MODAL_OPTIONS);
  };

  public cancelModal = (): void => {
    this.modalService.dismissAll();
    this.selectedPlace = null;
  };

  public clearWordOrCategory = (): void => {
    this.search.options.page = 1;
    this.search.word = null;
    this.search.label = null;
    this.search.category = null;
    this.launchSearch(true);
  };

  public clearLocation = (): void => {
    this.search.options.page = 1;
    this.search.location = {
      ...new GeoPosition({}),
      areas: new LocationAreas({ country: THEME_CONFIGURATION.country }),
    };
    this.launchSearch(true);
  };

  public clearSorting = (): void => {
    this.search.options = new ManageSearchOptions();
    this.launchSearch(true);
  };

  public setCatToExclude = (selectedCatToExclude: Categories[]): void => {
    this.search.catToExclude = selectedCatToExclude;
    this.launchSearch(true);
  };

  public getHasFilter = (): boolean => {
    return (
      this.search.category !== null ||
      this.search.word !== null ||
      this.search.lieu_id !== null ||
      (this.search.location?.geoType !== null &&
        this.search.location?.label !== null) ||
      this.search.close !== null ||
      this.search.status !== null ||
      this.search.options.page !== 1 ||
      this.search.visibility !== null ||
      this.search.organization !== null ||
      this.search.priority !== null ||
      this.search.toCampaignUpdate !== null ||
      this.search.campaignStatus !== null
    );
  };

  public static getIsCampaignActive(postalCode: string): boolean {
    return (
      THEME_CONFIGURATION.country === CountryCodes.FR &&
      postalCode &&
      campaignIsActive([
        getDepartmentCodeFromPostalCode(CountryCodes.FR, postalCode),
      ])
    );
  }

  public setAutonomy = (selectedAutonomies: string[]): void => {
    this.search.autonomy = selectedAutonomies as CampaignPlaceAutonomy[];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.search));
    this.launchSearch(true);
  };

  public setCampaignSource = (selectedCampaignSource: string[]): void => {
    this.search.sourceMaj = selectedCampaignSource as CampaignSource[];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.search));
    this.launchSearch(true);
  };
}
