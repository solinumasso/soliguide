import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { EMPTY, Subscription, switchMap, tap } from "rxjs";

import { ApiPlace, ExternalStructure, SearchResults } from "@soliguide/common";

import { User } from "../../../users/classes";
import { Place, MarkerOptions, THEME_CONFIGURATION } from "../../../../models";

import { SoligarePairService } from "../../services/soligare-pair.service";
import { AuthService } from "../../../users/services/auth.service";
import { SoligareSearchService } from "../../services/soligare-search.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { generateMarkerOptions, globalConstants } from "../../../../shared";
import { PlaceService } from "../../../place/services/place.service";
import { SearchPairing } from "../../classes";

@Component({
  selector: "app-soligare-matching",
  templateUrl: "./soligare-matching.component.html",
  styleUrls: ["./soligare-matching.component.css"],
})
export class SoligareMatchingComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  public search: SearchPairing;

  public sourceId: string;
  public additionalDuplicate: string;
  public loading: boolean;
  public routePrefix: string;

  public sourcePlace: Partial<ApiPlace>;
  public soliguidePlaces: Place[];
  public markers: MarkerOptions[];
  public me!: User | null;

  private subscription = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly placeService: PlaceService,
    private readonly translateService: TranslateService,
    private readonly soligarePairService: SoligarePairService,
    private readonly soligareSearchService: SoligareSearchService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly toastr: ToastrService
  ) {
    this.markers = [];
    this.soliguidePlaces = [];
    this.routePrefix = this.currentLanguageService.routePrefix;
    this.search = new SearchPairing();
  }

  ngOnInit(): void {
    this.loading = true;
    this.me = this.authService.currentUserValue;

    this.subscription.add(
      this.activatedRoute.params
        .pipe(
          tap((params: Params) => {
            this.sourceId = params?.source_id;
            this.loading = true;
            this.soliguidePlaces = [];
          }),
          switchMap(() => {
            if (!this.sourceId) {
              this.router.navigate([
                this.currentLanguageService.routePrefix,
                "404",
              ]);
              return EMPTY;
            }
            this.soligareSearchService
              .getExternalStructure(this.sourceId)
              .subscribe({
                next: (place: Partial<ApiPlace>) => {
                  this.sourcePlace = place;
                  setTimeout(() => {}, 10000);
                  this.initMarker(this.sourcePlace);
                  this.soligareSearchService
                    .getDuplicates(this.sourcePlace)
                    .subscribe({
                      next: (places: Place[]) => {
                        if (places) {
                          this.loading = false;
                          this.soliguidePlaces = places;
                        }
                        setTimeout(() => {}, 10000);
                        this.markers = [
                          ...this.markers,
                          ...generateMarkerOptions(
                            this.soliguidePlaces,
                            this.me
                          ),
                        ];
                        if (!places) {
                          this.loading = false;
                          this.soliguidePlaces = [];
                        }
                      },
                      error: () => {
                        this.toastr.warning(
                          this.translateService.instant("SEARCH_PLACE_FAILED")
                        );
                      },
                    });
                },
                error: () => {
                  this.toastr.warning(
                    this.translateService.instant(
                      "SEARCH_EXTERNAL_STRUCTURE_FAILED"
                    )
                  );
                },
              });

            return this.soliguidePlaces;
          })
        )
        .subscribe({
          next: (places) => {
            if (!places) {
              this.loading = false;
              this.toastr.warning(
                this.translateService.instant("SEARCH_PLACE_FAILED")
              );
            }
            this.loading = false;
            this.markers = [
              ...this.markers,
              ...generateMarkerOptions(this.soliguidePlaces, this.me),
            ];
            return;
          },
          error: () => {
            this.toastr.warning(
              this.translateService.instant("SEARCH_PLACE_FAILED")
            );
          },
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public pairPlaces(sourceId: string, soliguideId: number): void {
    this.soligarePairService.pair(sourceId, soliguideId).subscribe({
      next: () => {
        this.toastr.success(
          this.translateService.instant("PLACE_CREATION_SUCCESS")
        );

        this.loading = true;
        this.soliguidePlaces = [];

        const searchInLocalstorage = globalConstants.getItem("SOLIGARE_SEARCH");

        if (!searchInLocalstorage) {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "soligare",
          ]);
        } else {
          this.getNextPotentialDuplicate(searchInLocalstorage);
        }
      },
      error: () => {
        this.toastr.warning(this.translateService.instant("PAIRING_FAIL"));
      },
    });
  }

  public addPlace(soliguideId: string): void {
    this.placeService.getPlace(soliguideId).subscribe({
      next: (place: Place) => {
        this.soliguidePlaces.push(place);
        this.markers = [
          ...this.markers,
          ...generateMarkerOptions(this.soliguidePlaces, this.me),
        ];
      },
      error: () => {
        this.toastr.warning(
          this.translateService.instant("SEARCH_PLACE_FAILED")
        );
      },
    });
  }

  private initMarker(sourcePlace: Partial<ApiPlace>): void {
    this.markers = [
      {
        lng: sourcePlace.position.location.coordinates[0],
        lat: sourcePlace.position.location.coordinates[1],
        options: {
          id: 1,
          title: this.translateService.instant("DOT_ON_MAP"),
          icon: {
            url: "../../../../../assets/images/maps/new_pin.svg",
            scaledSize: {
              width: 32,
              height: 44,
            },
          },
        },
      },
    ];
  }

  private getNextPotentialDuplicate(search: SearchPairing): void {
    this.subscription.add(
      this.soligareSearchService.launchSearch(search).subscribe({
        next: (response: SearchResults<ExternalStructure>) => {
          const nextPotentialDuplicate: ExternalStructure = response.results[0];

          if (!nextPotentialDuplicate) {
            this.router.navigate([
              this.currentLanguageService.routePrefix,
              "soligare",
            ]);
          }

          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "soligare",
            "matching",
            nextPotentialDuplicate.id,
          ]);
        },
        error: () => {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "soligare",
          ]);
        },
      })
    );
  }
}
