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
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, type Params, Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { ReplaySubject, type Subject, Subscription, switchMap } from "rxjs";

import {
  SEARCH_MODALITIES_FILTERS,
  SEARCH_PUBLICS_FILTERS,
  GeoPosition,
  PlaceType,
  getDefaultSearchRadiusByGeoType,
  type LocationAutoCompleteAddress,
  slugString,
  Categories,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { SearchFiltersComponent } from "../search-filters/search-filters.component";
import { Search } from "../../interfaces";
import { SearchService } from "../../services/search.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { SeoService, LocationService } from "../../../shared/services";
import type { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import {
  type Place,
  type MarkerOptions,
  type SearchFilterParams,
  type SearchResults,
  PLACE_SEARCH_LIMIT,
  PARCOURS_SEARCH_LIMIT,
  THEME_CONFIGURATION,
} from "../../../../models";

import {
  generateMarkerOptions,
  globalConstants,
  fadeInOut,
} from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";

@Component({
  animations: [fadeInOut],
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, OnDestroy {
  public isMobileView: boolean = window.innerWidth < 768;
  // Results
  public places: Place[];
  public parcours: Place[];

  // Pages
  public searchCurrentPage: number;
  public parcoursSearchCurrentPage: number;

  // Search
  public nbResults: number;
  public nbParcoursResults: number;
  public loading: boolean;
  public parcoursLoading: boolean;
  public currentDistanceValue: number;

  // Search elements
  public search: Search;
  public readonly searchSubject: Subject<Search> = new ReplaySubject(1);
  public parcoursSearch: Search;
  public readonly parcoursSearchSubject: Subject<Search> = new ReplaySubject(1);

  private subscription = new Subscription();

  public queryParams: Params;

  public filters: SearchFilterParams;

  public readonly PlaceType = PlaceType;

  public sliderDefaultValue: number;

  // Leaflet Markers
  public markers: MarkerOptions[];

  // METAS
  public title: string;
  public description: string;

  public center: number[];
  public me!: User | null;
  public hideFilters: boolean;

  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  @ViewChild("appFilters") public appFilters!: SearchFiltersComponent;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly searchService: SearchService,
    private readonly seoService: SeoService,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly posthogService: PosthogService,
    private readonly locationService: LocationService
  ) {
    this.loading = true;
    this.parcoursLoading = true;
    this.markers = [];
    this.hideFilters = false;
    this.nbResults = 0;

    this.queryParams = {};
    this.nbParcoursResults = 0;

    this.places = [];
    this.parcours = [];

    this.filters = {};

    this.center = [];
    this.me = null;

    this.search = new Search();
    this.parcoursSearch = new Search({ placeType: PlaceType.ITINERARY });

    // Results limit
    this.search.options.limit = PLACE_SEARCH_LIMIT;
    this.parcoursSearch.options.limit = PARCOURS_SEARCH_LIMIT;

    // Default pages
    this.searchCurrentPage = 1;
    this.parcoursSearchCurrentPage = 1;
  }

  public ngOnInit(): void {
    this.hideFilters = this.isMobileView;
    this.me = this.authService.currentUserValue;
    this.title = this.translateService.instant("SEARCH_HELP_STRUCTURE", {
      brandName: THEME_CONFIGURATION.brandName,
    });
    this.description = this.translateService.instant("SEARCH_HELP_STRUCTURE", {
      brandName: THEME_CONFIGURATION.brandName,
    });

    this.translateService.onDefaultLangChange.subscribe({
      next: () => {
        this.title = this.translateService.instant("SEARCH_HELP_STRUCTURE", {
          brandName: THEME_CONFIGURATION.brandName,
        });
        this.description = this.translateService.instant(
          "SEARCH_HELP_STRUCTURE",
          { brandName: THEME_CONFIGURATION.brandName }
        );
        this.updateTitleAndTags();
      },
    });

    // URL change : category or location
    this.subscription.add(
      this.activatedRoute.params.subscribe((params: Params) => {
        this.checkCategoryInUrl(params);
        const position = this.activatedRoute.snapshot.params.position;
        this.checkPositionInUrl(position);
      })
    );

    // Parse route parameters route
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params: Params) => {
        // Pages
        this.setPlacePageFromParams(params);
        this.setParcoursPageFromParams(params);

        // Filters
        // TODO : public filters (select multiple options)
        this.setOpenFilterFromParams(params);
        this.setPublicsFiltersFromParams(params);
        this.setModalitiesFiltersFromParams(params);

        const language = params.languages;

        if (language) {
          this.filters.languages = language;
          this.search.languages = language;
          this.parcoursSearch.languages = language;
        }
      })
    );

    // Search launch
    this.subscription.add(
      this.searchSubject
        .pipe(
          switchMap((search: Search) => {
            this.places = [];
            this.markers = [];
            this.nbResults = 0;
            this.loading = true;
            this.updateTitleAndTags();

            // Saving last visited URL
            globalConstants.setItem("LAST_SEARCH_URL", {
              url: decodeURI(this.router.url.split("?")[0]),
              queryParams: this.activatedRoute.snapshot.queryParams,
            });

            return this.searchService.launchSearch(search);
          })
        )
        .subscribe({
          next: (response: SearchResults) => {
            this.nbResults = response.nbResults;
            this.loading = false;
            if (response.nbResults !== 0) {
              this.places = response.places;
              this.markers = generateMarkerOptions(this.places, this.me);
            }
          },
          error: () => {
            this.toastr.warning(
              this.translateService.instant("SEARCH_PLACE_FAILED")
            );
          },
        })
    );

    this.subscription.add(
      this.parcoursSearchSubject
        .pipe(
          switchMap((search: Search) => {
            this.parcours = [];
            this.nbParcoursResults = 0;
            this.parcoursLoading = true;

            return this.searchService.launchSearch(search);
          })
        )
        .subscribe({
          next: (response: SearchResults) => {
            this.nbParcoursResults = response.nbResults;
            this.parcoursLoading = false;

            if (response.nbResults !== 0) {
              this.parcours = response.places;
            }
          },
          error: () => {
            this.toastr.warning(
              this.translateService.instant("SEARCH_ITINERARIES_FAILED")
            );
          },
        })
    );
  }

  // TODO: separate this in a new component
  public updateDistance(value: number): void {
    this.captureEvent("update-search-distance", {
      from: this.search.location.distance,
      to: value,
    });

    if (this.search.location) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { placePage: null, parcoursPage: null },
        queryParamsHandling: "merge",
      });

      this.search.location.distance = value;
      this.parcoursSearch.location.distance = value;
      this.launchSearch(true);
      this.launchParcoursSearch();
    }
  }

  public setDistanceRange(): void {
    this.updateDistance(this.currentDistanceValue);
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public toggleFilter = (): void => {
    this.hideFilters = !this.hideFilters;
  };

  public toggleOpen = (): void => {
    this.appFilters.filterBoolean("openToday");
  };

  private setFilterValue = (
    optionalSearchParams: string,
    filterKey: string,
    value: string | boolean | number,
    toArray = false
  ): void => {
    this.filters[filterKey] = value;
    this.search[optionalSearchParams][filterKey] = toArray ? [value] : value;
    this.parcoursSearch[optionalSearchParams][filterKey] = toArray
      ? [value]
      : value;
  };

  private setOpenFilterFromParams = (params: Params): void => {
    if (params.openToday) {
      this.filters.openToday = true;
      this.search.openToday = true;
      this.parcoursSearch.openToday = true;
    }
  };

  private setPublicsFiltersFromParams = (params: Params): void => {
    this.search.publics = {};
    this.parcoursSearch.publics = {};

    for (const type of SEARCH_PUBLICS_FILTERS) {
      if (params[type]) {
        this.setFilterValue("publics", type, params[type], type !== "age");
      }
    }
  };

  private setModalitiesFiltersFromParams = (params: Params): void => {
    this.search.modalities = {};
    this.parcoursSearch.modalities = {};

    for (const type of SEARCH_MODALITIES_FILTERS) {
      if (params[type]) {
        this.setFilterValue("modalities", type, true);
      }
    }
  };

  public setPlacePageFromParams = (params: Params): void => {
    this.setPageFromParams(
      params,
      "placePage",
      this.searchCurrentPage,
      "search",
      this.launchSearch
    );
  };

  public setParcoursPageFromParams = (params: Params): void => {
    this.setPageFromParams(
      params,
      "parcoursPage",
      this.parcoursSearchCurrentPage,
      "parcoursSearch",
      this.launchParcoursSearch
    );
  };

  public setPageFromParams = (
    params: Params,
    paramsKey: string,
    currentPage: number,
    searchKey: string,
    searchFunction
  ): void => {
    const page = parseInt(params[paramsKey], 10);

    if (!isNaN(page)) {
      if (page !== +params[paramsKey]) {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { [paramsKey]: page },
          queryParamsHandling: "merge",
        });
      } else {
        if (currentPage !== page) {
          this[searchKey].options.page = page;
          this[`${searchKey}CurrentPage`] = page;

          searchFunction();
        }
      }
    } else {
      if (typeof params[paramsKey] === "string") {
        this.router.navigate([], {
          relativeTo: this.activatedRoute,
          queryParams: { [paramsKey]: 1 },
          queryParamsHandling: "merge",
        });
      }
    }
  };

  public getPosition = (position: string): void => {
    this.subscription.add(
      this.locationService.locationAutoComplete(position).subscribe({
        next: (addresses: LocationAutoCompleteAddress[]) => {
          const item = addresses[0];
          const searchPosition = new GeoPosition(item);
          this.locationService.localPositionSubject.next(searchPosition);
          // New location
          this.search.location = searchPosition;
          this.parcoursSearch.location = searchPosition;
          this.launchSearches();
          return;
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("ADDRESS_DOESNT_EXIST")
          );
        },
      })
    );
  };

  // This function have the the responsability to reset pages for search and parcoursSearch when filters/position/category changes
  public launchSearch = (isPagesMustBeReset: boolean): void => {
    if (isPagesMustBeReset) {
      this.resetPages();
    }

    this.searchSubject.next(this.search);
  };

  public launchParcoursSearch = (): void => {
    this.parcoursSearchSubject.next(this.parcoursSearch);
  };

  // Update the location from a sub-component
  public updateLocation = (item: LocationAutoCompleteAddress): void => {
    this.search.location = new GeoPosition(item);
    this.posthogService.capture("search-location-autocomplete", {
      search: this.search,
    });

    const categoryInUrl = this.activatedRoute.snapshot.params.category;

    this.updateCategoryOrWordInUrl(categoryInUrl);
  };

  // Update the category from a sub-component
  public updateCategory = (): void => {
    if (Object.values(Categories).includes(this.search.category)) {
      this.updateCategoryOrWordInUrl(this.search.category);
    }
  };

  public updateSearchTerm = (): void => {
    this.updateCategoryOrWordInUrl(this.search.word);
  };

  public updateFilters = (): void => {
    this.resetPages();
    this.search = new Search(this.search);
  };

  public launchSearchFromSearchBar = (): void => {
    if (this.search?.category) {
      this.updateCategoryOrWordInUrl(this.search.category);
    } else {
      this.updateCategoryOrWordInUrl(this.search.word);
    }
  };

  private updateCategoryOrWordInUrl = (categoryOrWord: string): void => {
    const urlParts = this.router.url.trim().split("/");
    const componentUrl = urlParts[2];

    if (!this.search.location.geoValue) {
      this.redirectToDefaultSearch();
      return;
    }

    const locationInUrl = this.search.location.geoValue;
    let urlToRedirect = `${this.currentLanguageService.routePrefix}/${componentUrl}/${locationInUrl}/`;

    if (categoryOrWord) {
      urlToRedirect += `${categoryOrWord.trim()}`;
    }

    this.router.navigate([urlToRedirect], {
      queryParams: { ...this.filters },
    });
  };

  private updateTitleAndTags = (): void => {
    this.subscription.add(
      this.translateService.get("SEARCH_TITRE").subscribe((value: string) => {
        this.title = value;
      })
    );

    if (this.search.category) {
      this.subscription.add(
        this.translateService
          .get(this.search.category.toUpperCase())
          .subscribe((value: string) => {
            this.title += ` ${value.toLowerCase()}`;
          })
      );
    } else if (this.search.word) {
      this.title += ` de « ${decodeURI(this.search.word)} »`;
    }

    this.subscription.add(
      this.translateService.get("AUTOUR_DE").subscribe((value: string) => {
        this.title += ` ${value} ${this.search.location.label}`;
        // Update tags
        this.seoService.updateTitleAndTags(this.title, this.description, true);
      })
    );
  };

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`search-${eventName}`, {
      ...properties,
      search: this.search,
      parcoursSearch: this.parcoursSearch,
      filters: this.filters,
    });
  }

  public setInitialSliderValue(): void {
    this.currentDistanceValue = getDefaultSearchRadiusByGeoType(
      this.search.location.geoType
    );

    this.search.location.distance = this.currentDistanceValue;
    this.parcoursSearch.location.distance = this.currentDistanceValue;
  }

  private checkCategoryInUrl(params: Params) {
    // Category
    if (params.category) {
      if (Object.values(Categories).includes(params.category)) {
        const category = params.category as Categories;
        this.search.category = category;
        this.parcoursSearch.category = category;

        this.search.word = null;
        this.parcoursSearch.word = null;

        this.subscription.add(
          this.translateService
            .get(this.search.category.toUpperCase())
            .subscribe((value: string) => {
              this.search.label = value;
              this.parcoursSearch.label = value;
            })
        );
      } else {
        const wordInUrl = decodeURI(params.category);
        // Recherche par mot
        this.search.category = null;
        this.parcoursSearch.category = null;

        this.search.word = slugString(wordInUrl);
        this.parcoursSearch.word = slugString(wordInUrl);

        this.search.label = wordInUrl;
        this.parcoursSearch.label = wordInUrl;
      }
    }
  }

  private checkPositionInUrl(position?: string): void {
    if (!position) {
      this.redirectToDefaultSearch();
      return;
    }

    const sessionPosition = globalConstants.getItem("POSITION");

    if (sessionPosition) {
      const lastPosition = new GeoPosition(sessionPosition);
      if (lastPosition.geoValue === position) {
        this.search.location = lastPosition;
        this.parcoursSearch.location = lastPosition;
        this.launchSearches();
        return;
      }
    }
    this.getPosition(position);
    return;
  }

  private launchSearches() {
    this.setInitialSliderValue();
    this.launchSearch(true);
    this.launchParcoursSearch();
  }

  private resetPages() {
    this.search.options.page = 1;
    this.searchCurrentPage = 1;

    this.parcoursSearch.options.page = 1;
    this.parcoursSearchCurrentPage = 1;
  }

  private redirectToDefaultSearch() {
    this.toastr.warning(
      this.translateService.instant("PLEASE_CHOOSE_LOCATION")
    );
    this.router.navigate([
      this.currentLanguageService.routePrefix,
      "search",
      "paris",
    ]);
  }

  public setPageToUrl(isPlacePage: boolean): void {
    if (isPlacePage) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { placePage: this.search.options.page },
        queryParamsHandling: "merge",
      });
    } else {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: { parcoursPage: this.parcoursSearch.options.page },
        queryParamsHandling: "merge",
      });
    }
  }
}
