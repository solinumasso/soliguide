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
  public showFilters: boolean;

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
    this.showFilters = true;
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
    this.showFilters = !this.isMobileView;
    this.me = this.authService.currentUserValue;
    this.initializeDefaultTitles();

    // Initialize searchBarService if needed
    if (!this.searchBarService.isReady()) {
      this.searchBarService.initialize();
    }

    // ========================================
    // SINGLE REACTIVE FLOW: URL is the source of truth
    // ========================================
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams,
      this.searchBarService.initialization$.pipe(filter((ready) => ready)),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, queryParams]) => {
        console.log("🔄 URL changed, rebuilding search from URL...", {
          params,
          queryParams,
        });
        this.buildSearchFromUrl(params, queryParams);
      });

    // ========================================
    // Listen to language changes
    // ========================================
    this.translateService.onDefaultLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.initializeDefaultTitles();
        this.updateTitleAndTags();
      });

    // ========================================
    // Search execution streams
    // ========================================
    merge(
      this.searchSubject.pipe(
        tap(() => {
          this.places = [];
          this.markers = [];
          this.nbResults = 0;
          this.loading = true;
          this.updateTitleAndTags();

          // Save last visited URL
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
        (result: {
          type: PlaceType;
          response: SearchResults<Place>;
          error?: unknown;
        }) => {
          if ("error" in result) {
            const message =
              result.type === PlaceType.PLACE
                ? "SEARCH_PLACE_FAILED"
                : "SEARCH_ITINERARIES_FAILED";
            this.toastr.warning(this.translateService.instant(message));
            return;
          }

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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  // ========================================
  // CORE: Build search objects from URL (single source of truth)
  // ========================================
  private buildSearchFromUrl(params: Params, queryParams: Params): void {
    const position = params.position;

    if (!position) {
      this.redirectToDefaultSearch();
      return;
    }

    // Store queryParams for child components
    this.queryParams = queryParams;

    // Parse all data from URL
    const category = params.category;
    const placePage = this.parsePageParam(queryParams.placePage);
    const parcoursPage = this.parsePageParam(queryParams.parcoursPage);

    // Build new search objects
    const newSearch = new Search();
    const newParcoursSearch = new Search({ placeType: PlaceType.ITINERARY });

    // Apply limits
    newSearch.options.limit = PLACE_SEARCH_LIMIT;
    newParcoursSearch.options.limit = PARCOURS_SEARCH_LIMIT;

    // Apply pages
    newSearch.options.page = placePage;
    newParcoursSearch.options.page = parcoursPage;

    // Apply category/word
    this.applySearchTerm(category, newSearch, newParcoursSearch);

    // Apply ALL filters from queryParams
    this.applyAllFilters(queryParams, newSearch, newParcoursSearch);

    // Apply position (async if needed)
    this.applyPosition(position, newSearch, newParcoursSearch, () => {
      // Finalize: assign to component properties
      this.search = newSearch;
      this.parcoursSearch = newParcoursSearch;
      this.searchCurrentPage = placePage;
      this.parcoursSearchCurrentPage = parcoursPage;

      console.log("✅ Search objects built from URL:", {
        category: this.search.category,
        word: this.search.word,
        location: this.search.location.label,
        placePage: this.search.options.page,
        parcoursPage: this.parcoursSearch.options.page,
        filters: this.filters,
      });

      // Launch searches
      this.launchSearches();
    });
  }

  private parsePageParam(pageParam: string | undefined): number {
    if (!pageParam) return 1;
    const page = parseInt(pageParam, 10);
    return isNaN(page) ? 1 : page;
  }

  private applySearchTerm(
    category: string | undefined,
    search: Search,
    parcoursSearch: Search
  ): void {
    if (!category) return;

    let foundItem = this.searchBarService.findByCategoryId(
      category as Categories
    );

    if (!foundItem) {
      foundItem = this.searchBarService.findBySlug(category);
    }

    if (foundItem) {
      console.log(`🎯 ${foundItem.type} found in suggestions`, foundItem);

      search.applySearchSuggestion(foundItem);
      parcoursSearch.applySearchSuggestion(foundItem);

      // SEO metadata
      if (foundItem.seoTitle) {
        this.title = foundItem.seoTitle;
      }
      if (foundItem.seoDescription) {
        this.description = foundItem.seoDescription;
      }
    } else {
      // Fallback: search the word
      const wordInUrl = decodeURI(category);
      search.setWord(slugString(wordInUrl), wordInUrl);
      parcoursSearch.setWord(slugString(wordInUrl), wordInUrl);
    }
  }

  private applyAllFilters(
    queryParams: Params,
    search: Search,
    parcoursSearch: Search
  ): void {
    // Reset filters
    this.filters = {};
    search.publics = {};
    parcoursSearch.publics = {};
    search.modalities = {};
    parcoursSearch.modalities = {};

    // Open today
    if (queryParams.openToday) {
      this.filters.openToday = true;
      search.openToday = true;
      parcoursSearch.openToday = true;
    }

    // Publics filters
    for (const type of SEARCH_PUBLICS_FILTERS) {
      if (queryParams[type]) {
        this.filters[type] = queryParams[type];
        const value = queryParams[type];

        if (type === "age") {
          search.publics[type] = value;
          parcoursSearch.publics[type] = value;
        } else {
          search.publics[type] = [value];
          parcoursSearch.publics[type] = [value];
        }
      }
    }

    // Modalities filters
    for (const type of SEARCH_MODALITIES_FILTERS) {
      if (queryParams[type]) {
        this.filters[type] = true;
        search.modalities[type] = true;
        parcoursSearch.modalities[type] = true;
      }
    }

    // Languages
    if (queryParams.languages) {
      this.filters.languages = queryParams.languages;
      search.languages = queryParams.languages;
      parcoursSearch.languages = queryParams.languages;
    }

    // Keep ALL other queryParams that might exist
    // This ensures we don't lose any custom filters
    Object.keys(queryParams).forEach((key) => {
      if (
        key !== "placePage" &&
        key !== "parcoursPage" &&
        key !== "openToday" &&
        key !== "languages" &&
        !SEARCH_PUBLICS_FILTERS.includes(key) &&
        !SEARCH_MODALITIES_FILTERS.includes(key)
      ) {
        this.filters[key] = queryParams[key];
      }
    });
  }

  private applyPosition(
    position: string,
    search: Search,
    parcoursSearch: Search,
    onComplete: () => void
  ): void {
    // Check cache first
    const sessionPosition = globalConstants.getItem("POSITION");

    if (sessionPosition) {
      const cachedPosition = new GeoPosition(sessionPosition);
      if (cachedPosition.geoValue === position) {
        console.log("📍 Using cached position");
        search.location = cachedPosition;
        parcoursSearch.location = cachedPosition;
        this.setInitialSliderValue(search, parcoursSearch);
        onComplete();
        return;
      }
    }

    // Load from API
    console.log("📍 Loading position from API:", position);
    this.subscription.add(
      this.locationService.locationAutoComplete(position).subscribe({
        next: (addresses: LocationAutoCompleteAddress[]) => {
          const item = addresses[0];
          const geoPosition = new GeoPosition(item);
          this.locationService.localPositionSubject.next(geoPosition);

          search.location = geoPosition;
          parcoursSearch.location = geoPosition;
          this.setInitialSliderValue(search, parcoursSearch);

          onComplete();
        },
        error: () => {
          this.toastr.error(
            this.translateService.instant("ADDRESS_DOESNT_EXIST")
          );
          this.redirectToDefaultSearch();
        },
      })
    );
  }

  private setInitialSliderValue(search: Search, parcoursSearch: Search): void {
    this.currentDistanceValue = getDefaultSearchRadiusByGeoType(
      search.location.geoType
    );
    search.location.distance = this.currentDistanceValue;
    parcoursSearch.location.distance = this.currentDistanceValue;
  }

  private launchSearches(): void {
    this.updateTitleAndTags();
    this.searchSubject.next(this.search);
    this.parcoursSearchSubject.next(this.parcoursSearch);
  }

  // ========================================
  // UI ACTIONS: All update URL (source of truth)
  // ========================================

  public updateDistance(value: number): void {
    this.captureEvent("update-search-distance", {
      from: this.search.location.distance,
      to: value,
    });

    if (this.search.location) {
      this.search.location.distance = value;
      this.parcoursSearch.location.distance = value;

      // Distance is not in URL, launch directly
      this.searchSubject.next(this.search);
      this.parcoursSearchSubject.next(this.parcoursSearch);
    }
  }

  public setDistanceRange(): void {
    this.updateDistance(this.currentDistanceValue);
  }

  public toggleFilter = (): void => {
    this.showFilters = !this.showFilters;
  };

  public toggleOpen = (): void => {
    // Toggle openToday in URL
    const currentQueryParams = this.activatedRoute.snapshot.queryParams;
    const newOpenToday = currentQueryParams.openToday ? null : true;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        openToday: newOpenToday,
        placePage: null,
        parcoursPage: null,
      },
      queryParamsHandling: "merge",
    });
  };

  public updateLocation = (item: LocationAutoCompleteAddress): void => {
    const geoPosition = new GeoPosition(item);
    this.posthogService.capture("search-location-autocomplete", {
      search: this.search,
    });

    const categoryInUrl = this.activatedRoute.snapshot.params.category;
    this.navigateToSearch(categoryInUrl, geoPosition.geoValue);
  };

  public updateCategory = (): void => {
    const categoryOrWord = this.search.category || this.search.word;
    if (categoryOrWord) {
      this.navigateToSearch(categoryOrWord, this.search.location.geoValue);
    }
  };

  public launchSearchFromSearchBar = (): void => {
    const categoryOrWord = this.search.category || this.search.word;
    if (categoryOrWord) {
      this.navigateToSearch(categoryOrWord, this.search.location.geoValue);
    }
  };

  public updateFilters = (): void => {
    // Called by search-filters component after it modifies this.filters
    // Update URL with current filters, preserving all existing queryParams
    const currentQueryParams = this.activatedRoute.snapshot.queryParams;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        ...currentQueryParams, // Keep all existing params
        ...this.filters, // Apply filter changes
        placePage: null, // Reset pagination
        parcoursPage: null,
      },
    });
  };

  public setPageToUrl(isPlacePage: boolean): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: isPlacePage
        ? { placePage: this.search.options.page }
        : { parcoursPage: this.parcoursSearch.options.page },
      queryParamsHandling: "merge",
    });
  }

  private navigateToSearch(categoryOrWord: string, location: string): void {
    if (!location) {
      this.redirectToDefaultSearch();
      return;
    }

    const urlParts = this.router.url.trim().split("/");
    const componentUrl = urlParts[2];

    let urlToRedirect = `${this.currentLanguageService.routePrefix}/${componentUrl}/${location}/`;

    if (categoryOrWord) {
      urlToRedirect += `${categoryOrWord.trim()}`;
    }

    // Preserve all current filters when navigating
    const currentQueryParams = this.activatedRoute.snapshot.queryParams;

    this.router.navigate([urlToRedirect], {
      queryParams: currentQueryParams,
    });
  }

  // ========================================
  // HELPERS
  // ========================================

  private initializeDefaultTitles(): void {
    this.title = this.translateService.instant("SEARCH_HELP_STRUCTURE", {
      brandName: THEME_CONFIGURATION.brandName,
    });
    this.description = this.translateService.instant("SEARCH_HELP_STRUCTURE", {
      brandName: THEME_CONFIGURATION.brandName,
    });
  }

  private redirectToDefaultSearch(): void {
    this.toastr.warning(
      this.translateService.instant("PLEASE_CHOOSE_LOCATION")
    );
    this.router.navigate([
      this.currentLanguageService.routePrefix,
      "search",
      "paris",
    ]);
  }

  private readonly updateTitleAndTags = (): void => {
    const foundItem = this.search.word
      ? this.searchBarService.findBySlug(this.search.word)
      : this.search.category
      ? this.searchBarService.findByCategoryId(this.search.category)
      : null;

    if (foundItem?.seoTitle && foundItem.seoDescription) {
      this.title = `${foundItem.seoTitle} ${this.search.location.label}`;
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
}
