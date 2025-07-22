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
import {
  catchError,
  combineLatest,
  filter,
  map,
  merge,
  of,
  ReplaySubject,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs";

import {
  SEARCH_MODALITIES_FILTERS,
  SEARCH_PUBLICS_FILTERS,
  GeoPosition,
  PlaceType,
  getDefaultSearchRadiusByGeoType,
  type LocationAutoCompleteAddress,
  slugString,
  Categories,
  SearchResults,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import { SearchFiltersComponent } from "../search-filters/search-filters.component";
import { Search, SearchFilterParams } from "../../interfaces";
import { SearchService } from "../../services/search.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { SeoService, LocationService } from "../../../shared/services";
import type { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import {
  type Place,
  type MarkerOptions,
  THEME_CONFIGURATION,
} from "../../../../models";

import {
  generateMarkerOptions,
  globalConstants,
  fadeInOut,
} from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { SearchBarService } from "../../../search-bar/services/search-bar.service";
import { PARCOURS_SEARCH_LIMIT, PLACE_SEARCH_LIMIT } from "../../constants";

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

  private readonly subscription = new Subscription();

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
  private readonly destroy$ = new Subject<void>();

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
    private readonly locationService: LocationService,
    private readonly searchBarService: SearchBarService
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
    this.initializeDefaultTitles();

    // ========================================
    // 1. Routes & QueryParams
    // ========================================
    combineLatest([this.activatedRoute.params, this.activatedRoute.queryParams])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, queryParams]) => {
        this.checkSearchTermInUrl(params);
        const position = this.activatedRoute.snapshot.params.position;
        this.checkPositionInUrl(position);
        this.processQueryParams(queryParams);
      });

    // ========================================
    // 2. Languages
    // ========================================
    this.translateService.onDefaultLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initializeDefaultTitles();
        this.updateTitleAndTags();
      });

    // ========================================
    // 3. Search Places & Parcours
    // ========================================
    merge(
      this.searchSubject.pipe(
        tap(() => {
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
        }),
        switchMap((search: Search) =>
          this.searchService.launchSearch(search).pipe(
            map((response) => ({ type: PlaceType.PLACE, response })),
            catchError(() => of({ type: PlaceType.PLACE, error: true }))
          )
        )
      ),
      this.parcoursSearchSubject.pipe(
        tap(() => {
          this.parcours = [];
          this.nbParcoursResults = 0;
          this.parcoursLoading = true;
        }),
        switchMap((search: Search) =>
          this.searchService.launchSearch(search).pipe(
            map((response) => ({ type: PlaceType.ITINERARY, response })),
            catchError(() => of({ type: PlaceType.ITINERARY, error: true }))
          )
        )
      )
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result: {
          type: PlaceType;
          response: SearchResults<Place>;
          error?: unknown;
        }) => {
          if ("error" in result) {
            // Gestion d'erreur selon le type
            const message =
              result.type === PlaceType.PLACE
                ? "SEARCH_PLACE_FAILED"
                : "SEARCH_ITINERARIES_FAILED";
            this.toastr.warning(this.translateService.instant(message));
            return;
          }

          // Affichage immédiat des résultats selon le type
          if (result.type === PlaceType.PLACE) {
            this.nbResults = result.response.nbResults;
            this.loading = false;
            if (result.response.nbResults !== 0) {
              this.places = result.response.results;
              this.markers = generateMarkerOptions(this.places, this.me);
            }
          } else {
            this.nbParcoursResults = result.response.nbResults;
            this.parcoursLoading = false;
            if (result.response.nbResults !== 0) {
              this.parcours = result.response.results;
            }
          }
        }
      );
  }

  private initializeDefaultTitles(): void {
    this.title = this.translateService.instant("SEARCH_HELP_STRUCTURE", {
      brandName: THEME_CONFIGURATION.brandName,
    });
    this.description = this.translateService.instant("SEARCH_HELP_STRUCTURE", {
      brandName: THEME_CONFIGURATION.brandName,
    });
  }

  private processQueryParams(params: Params): void {
    // Pages
    this.setPageFromParams(
      params,
      "placePage",
      this.search,
      "searchCurrentPage",
      () => this.launchSearch(false)
    );
    this.setPageFromParams(
      params,
      "parcoursPage",
      this.parcoursSearch,
      "parcoursSearchCurrentPage",
      () => this.launchParcoursSearch()
    );

    // Filters
    this.setOpenFilterFromParams(params);
    this.setPublicsFiltersFromParams(params);
    this.setModalitiesFiltersFromParams(params);

    // Languages
    const language = params.languages;
    if (language) {
      this.filters.languages = language;
      this.search.languages = language;
      this.parcoursSearch.languages = language;
    }
  }

  private setPageFromParams(
    params: Params,
    paramKey: string,
    searchObj: Search,
    currentPageProp: string,
    searchFn: () => void
  ): void {
    const pageParam = params[paramKey];

    if (!pageParam) return;

    const page = parseInt(pageParam, 10);
    const currentPage = this[currentPageProp];

    if (isNaN(page)) {
      this.updatePageInUrl(paramKey, 1);
      return;
    }

    if (page !== +pageParam) {
      this.updatePageInUrl(paramKey, page);
      return;
    }

    // Mise à jour si la page a changé
    if (currentPage !== page) {
      searchObj.options.page = page;
      this[currentPageProp] = page;
      searchFn();
    }
  }

  private updatePageInUrl(paramKey: string, page: number): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { [paramKey]: page },
      queryParamsHandling: "merge",
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
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

  public toggleFilter = (): void => {
    this.hideFilters = !this.hideFilters;
  };

  public toggleOpen = (): void => {
    this.appFilters.filterBoolean("openToday");
  };

  private checkSearchTermInUrl(params: Params): void {
    if (!params.category) {
      return;
    }

    this.searchBarService.initialization$
      .pipe(
        filter((isReady) => isReady),
        take(1)
      )
      .subscribe(() => {
        this.processSearchTerm(params.category);
      });

    if (!this.searchBarService.isReady()) {
      this.searchBarService.initialize();
    }
  }

  private processSearchTerm(categoryParam: string): void {
    let foundItem = this.searchBarService.findByCategoryId(
      categoryParam as Categories
    );

    if (!foundItem) {
      foundItem = this.searchBarService.findBySlug(categoryParam);
    }

    if (foundItem) {
      console.log(`🎯 ${foundItem.type} found in suggestions `, foundItem);

      this.search.applySearchSuggestion(foundItem);
      this.parcoursSearch.applySearchSuggestion(foundItem);

      this.search = new Search(this.search);
      this.parcoursSearch = new Search(this.parcoursSearch);

      // SEO metadata
      if (foundItem.seoTitle) {
        this.title = foundItem.seoTitle;
      }
      if (foundItem.seoDescription) {
        this.description = foundItem.seoDescription;
      }
    } else {
      // Fallback: search the word
      const wordInUrl = decodeURI(categoryParam);

      this.search.setWord(slugString(wordInUrl), wordInUrl);
      this.parcoursSearch.setWord(slugString(wordInUrl), wordInUrl);
    }
  }

  private readonly setFilterValue = (
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

  private readonly setOpenFilterFromParams = (params: Params): void => {
    if (params.openToday) {
      this.filters.openToday = true;
      this.search.openToday = true;
      this.parcoursSearch.openToday = true;
    }
  };

  private readonly setPublicsFiltersFromParams = (params: Params): void => {
    this.search.publics = {};
    this.parcoursSearch.publics = {};

    for (const type of SEARCH_PUBLICS_FILTERS) {
      if (params[type]) {
        this.setFilterValue("publics", type, params[type], type !== "age");
      }
    }
  };

  private readonly setModalitiesFiltersFromParams = (params: Params): void => {
    this.search.modalities = {};
    this.parcoursSearch.modalities = {};

    for (const type of SEARCH_MODALITIES_FILTERS) {
      if (params[type]) {
        this.setFilterValue("modalities", type, true);
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
          this.search.location = searchPosition;
          this.parcoursSearch.location = searchPosition;
          this.launchSearches();
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

  public updateCategory = (): void => {
    if (this.search.category) {
      this.updateCategoryOrWordInUrl(this.search.category);
    } else if (this.search.word) {
      this.updateCategoryOrWordInUrl(this.search.word);
    }
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

  private readonly updateCategoryOrWordInUrl = (
    categoryOrWord: string
  ): void => {
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

  private readonly updateTitleAndTags = (): void => {
    const foundItem = this.search.word
      ? this.searchBarService.findBySlug(this.search.word)
      : this.search.category
      ? this.searchBarService.findByCategoryId(this.search.category)
      : null;

    if (foundItem?.seoTitle && foundItem.seoDescription) {
      this.title = `${foundItem.seoTitle} - ${this.search.location.label}`;
      this.description = `${foundItem.seoDescription} ${this.search.location.label}`;

      this.seoService.updateTitleAndTags(this.title, this.description, true);
    } else {
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
          this.seoService.updateTitleAndTags(
            this.title,
            this.description,
            true
          );
        })
      );
    }
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
  }

  private launchSearches() {
    this.updateTitleAndTags();
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
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: isPlacePage
        ? { placePage: this.search.options.page }
        : { parcoursPage: this.parcoursSearch.options.page },
      queryParamsHandling: "merge",
    });
  }
}
