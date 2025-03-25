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
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { type Subject, ReplaySubject, Subscription } from "rxjs";

import {
  LEGACY_CATEGORIES,
  SEARCH_MODALITIES_FILTERS,
  SEARCH_PUBLICS_FILTERS,
  SUPPORTED_LANGUAGES,
  WIDGETS_AVAILABLE,
  type GeoPosition,
  GeoTypes,
  type PublicsElement,
  type SearchModalities,
  WidgetId,
  CountryCodes,
  Categories,
  SupportedLanguagesCode,
} from "@soliguide/common";

import { SearchService } from "../../services/search.service";
import {
  CATEGORIES_TITLE,
  Search,
  SearchResults,
  WidgetPlace,
  WidgetThemeProperties,
} from "../../../../models";
import { ThemeService } from "../../../../services/theme.service";
import { globalConstants } from "../../../../shared";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, OnDestroy {
  // Results
  public places: WidgetPlace[];

  public readonly LEGACY_CATEGORIES = LEGACY_CATEGORIES;

  public nbResults: number;
  public loading: boolean;
  public title: string;

  public customColors: { [key in WidgetThemeProperties]?: string };

  public search: Search;
  public searchSubject: Subject<Search> = new ReplaySubject(1);

  private subscription = new Subscription();

  public langClass = "";
  public maskLocationSearch: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private themeService: ThemeService,
    private toastr: ToastrService,
    private translateService: TranslateService
  ) {
    this.loading = false;
    this.nbResults = 0;
    this.places = [];
    this.customColors = {};
    this.search = new Search({
      widgetId: WidgetId.SOLINUM,
      lang: SupportedLanguagesCode.FR,
      location: {
        label: "Paris",
        coordinates: [2.3522219, 48.856614],
        geoType: GeoTypes.CITY,
        slugs: {},
        geoValue: "paris-75",
        areas: {
          slugs: {},
          country: CountryCodes.FR,
          pays: "france",
          regionCode: "11",
          departmentCode: "75",
          postalCode: "75009",
          department: "Paris",
          region: "Île-de-France",
          city: "Paris",
        },
        distance: 5,
      },
    });
    this.title = "";
    this.maskLocationSearch = false;
  }

  public ngOnInit(): void {
    // Changes in URL: language, widgetId or category
    this.subscription.add(
      this.activatedRoute.params.subscribe((params: Params) => {
        // Language
        let lang = params["lang"];

        if (SUPPORTED_LANGUAGES.indexOf(lang) === -1) {
          lang = "fr";
        }
        this.search.lang = lang;

        this.langClass = "lang-" + lang;
        this.translateService.use(lang);

        // WidgetId
        const widgetId = params["widgetId"];

        if (WIDGETS_AVAILABLE.indexOf(widgetId) === -1) {
          this.router.navigate(["/404"]);
          return;
        }

        this.search.widgetId = widgetId;

        if (Object.values(Categories).includes(params["category"])) {
          this.search.category = params["category"];
          this.title =
            CATEGORIES_TITLE[this.search.category as Categories] ?? "";

          delete this.search.word;
        }
        // Searching by word
        else if (params["category"] === "PASS") {
          this.search.category = Categories.HEALTH;
          this.search.word = "PASS";

          this.title = "CAT_PASS_TITLE";
        } else if (params["category"] !== "none") {
          delete this.search.category;
          this.search.word = params["category"];
        }
        // Searching by multiple categories
        else {
          delete this.search.category;
          delete this.search.word;
        }
      })
    );

    this.subscription.add(
      this.activatedRoute.queryParams?.subscribe((params: Params) => {
        for (const property of SEARCH_PUBLICS_FILTERS) {
          const publicsElements: string = params[property];

          if (publicsElements) {
            publicsElements.split(",").forEach((publicElement: string) => {
              if (publicElement) {
                if (this.search.publics) {
                  if (property === "age" && /^\d{0,2}$/.test(publicElement)) {
                    this.search.publics.age = parseInt(publicElement, 10);
                  } else if (property !== "age") {
                    if (this.search.publics[property as PublicsElement]) {
                      (
                        this.search.publics[
                          property as PublicsElement
                        ] as string[]
                      ).push(publicElement);
                    } else {
                      (this.search.publics[
                        property as PublicsElement
                      ] as string[]) = [publicElement];
                    }
                  }
                } else {
                  if (property === "age" && /^\d{0,2}$/.test(publicElement)) {
                    this.search["publics"] = {
                      age: parseInt(publicElement, 10),
                    };
                  } else if (property !== "age") {
                    this.search["publics"] = { [property]: [publicElement] };
                  }
                }
              } else {
                if (this.search.publics) {
                  delete this.search.publics[property as PublicsElement];
                }
              }
            });
          }
        }

        for (const property of SEARCH_MODALITIES_FILTERS) {
          const modalityElement: string = params[property];

          if (modalityElement === "true") {
            if (this.search.modalities) {
              (this.search.modalities[
                property as keyof SearchModalities
              ] as boolean) = true;
            } else {
              this.search["modalities"] = { [property]: true };
            }
          } else {
            if (this.search.modalities) {
              delete this.search.modalities[property as keyof SearchModalities];
            }
          }
        }

        let locations: string = params["geoValueCountries"];
        if (locations) {
          this.assignLocations(locations, GeoTypes.COUNTRY);
        }

        locations = params["geoValueRegions"];
        if (locations) {
          this.assignLocations(locations, GeoTypes.REGION);
        }

        locations = params["geoValueDepartments"];
        if (locations) {
          this.assignLocations(locations, GeoTypes.DEPARTMENT);
        }

        locations = params["geoValueCities"];
        if (locations) {
          this.assignLocations(locations, GeoTypes.CITY);
        }

        const categories: string = params["categories"];

        if (categories) {
          this.search.categories = categories
            .split(",")
            .map((category: string) => category as Categories);
        }

        for (const property of Object.values(WidgetThemeProperties)) {
          const colorElement: string = params[property];

          if (colorElement) {
            this.customColors[property] = `#${colorElement}`;
          }
        }
      })
    );

    this.subscription.add(
      this.searchSubject.subscribe((search: Search) => {
        this.loading = true;
        this.nbResults = 0;
        this.places = [];

        this.searchService.launchSearch(search).subscribe({
          next: (response: SearchResults) => {
            this.nbResults = response.nbResults;
            this.loading = false;

            if (response.nbResults !== 0) {
              this.places = response.places.map((place: WidgetPlace) => {
                place.distance = this.calculateDistance(
                  this.search.location.coordinates[0],
                  this.search.location.coordinates[1],
                  place.position.location.coordinates[0],
                  place.position.location.coordinates[1]
                );
                return place;
              });

              setTimeout(() => {
                this.themeService.setWidgetId(this.search.widgetId);
              }, 100);
              setTimeout(() => {
                for (const property in this.customColors) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      this.customColors,
                      property
                    )
                  ) {
                    this.themeService.setPropertyColor(
                      property as WidgetThemeProperties,
                      this.customColors[property as WidgetThemeProperties] || ""
                    );
                  }
                }
              }, 100);
            }
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("SEARCH_FAIL_TRY_LATER")
            );
          },
        });
      })
    );

    this.refreshCurrentLocation();

    this.launchSearch();
  }

  public refreshCurrentLocation = (): void => {
    const location = globalConstants.getItem("SOLIGUIDE_CURRENT_LOCATION");
    if (location) {
      this.search.location = location as GeoPosition;
    }
  };

  public launchSearch = (): void => {
    this.searchSubject.next(this.search);
  };

  // Update de la location depuis un sous-composant
  public updateLocation = (): void => {
    this.searchSubject.next(this.search);
  };

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public calculateDistance = (
    latFrom: number,
    lngFrom: number,
    latTo: number,
    lngTo: number
  ): number => {
    const radlat1 = (Math.PI * latFrom) / 180;
    const radlat2 = (Math.PI * latTo) / 180;
    const theta = lngFrom - lngTo;
    const radtheta = (Math.PI * theta) / 180;

    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;

    return dist;
  };

  private assignLocations = (locations: string, geoType: GeoTypes): void => {
    if (!this.search.locations) {
      this.search.locations = [];
    }

    for (const location of locations.split(",")) {
      this.search.locations.push({ geoValue: location, geoType });
    }

    this.maskLocationSearch = true;
  };
}
