import { Component, OnInit, OnDestroy } from "@angular/core";
import { ReplaySubject, Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

import {
  PAIRING_SOURCES,
  ExternalStructure,
  SearchResults,
  AnyDepartmentCode,
} from "@soliguide/common";

import { THEME_CONFIGURATION } from "../../../../models";
import { AuthService } from "../../../users/services/auth.service";
import { SoligareSearchService } from "../../services/soligare-search.service";
import { AvailableSourceService } from "../../services/available-source.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { globalConstants } from "../../../../shared";
import { SearchPairing } from "../../classes";

@Component({
  selector: "app-soligare-pairing",
  templateUrl: "./soligare-pairing.component.html",
  styleUrls: ["./soligare-pairing.component.css"],
})
export class SoligarePairingComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public loading: boolean;
  public isSearchLaunched: boolean;
  public nbResults: number;
  public routePrefix: string;

  public PAIRING_SOURCES_VALUES = PAIRING_SOURCES;
  public places: ExternalStructure[];
  public availableSources: string[];

  private subscription = new Subscription();
  public searchSubject = new ReplaySubject<SearchPairing>(1);
  public searchPairing: SearchPairing;
  public readonly availableSourcesSubject = new ReplaySubject<
    AnyDepartmentCode[]
  >(1);

  constructor(
    private readonly authService: AuthService,
    private readonly translateService: TranslateService,
    private readonly toastr: ToastrService,
    private readonly availableSourceService: AvailableSourceService,
    private readonly soligareSearchService: SoligareSearchService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.loading = false;
    this.places = [];
    this.nbResults = 0;
    this.isSearchLaunched = false;

    this.searchPairing = new SearchPairing(
      globalConstants.getItem("SOLIGARE_SEARCH")
    );

    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  ngOnInit() {
    if (!this.searchPairing.territories.length) {
      this.searchPairing.territories =
        this.authService?.currentUserValue?.territories;
    }

    this.launchAvailableSources();
    this.launchSearch();

    this.subscription.add(
      this.availableSourcesSubject.subscribe(
        (territories: AnyDepartmentCode[]) => {
          this.availableSourceService
            .getAvailableSource(territories)
            .subscribe({
              next: (sources: string[]) => {
                this.availableSources = sources;
                this.loading = false;
                setTimeout(() => {}, 2000);
                return;
              },
              error: () => {
                this.loading = false;
                this.toastr.warning(
                  this.translateService.instant("GET_AVAILABLE_SOURCES_FAILED")
                );
              },
            });
        }
      )
    );

    this.subscription.add(
      this.searchSubject.subscribe((search: SearchPairing) => {
        this.places = [];
        this.nbResults = 0;
        this.loading = true;
        this.isSearchLaunched = true;

        if (!this.searchPairing.sources.length) {
          this.loading = false;
          this.toastr.warning(
            this.translateService.instant("PROVIDE_A_PARTNER")
          );
          return;
        }

        if (!this.searchPairing.territories.length) {
          this.loading = false;
          this.toastr.warning(
            this.translateService.instant("PROVIDE_MINIMUM_ONE_DEPARTMENT")
          );
          return;
        }

        this.soligareSearchService.launchSearch(search).subscribe({
          next: (response: SearchResults<ExternalStructure>) => {
            this.nbResults = response.nbResults;
            this.isSearchLaunched = true;
            this.loading = false;
            this.places = response.results;

            if (this.nbResults && !this.places.length) {
              this.searchPairing.options.page = 1;
              globalConstants.setItem("SOLIGARE_SEARCH", this.searchPairing);
              this.launchSearch();
            }
          },
          error: () => {
            this.loading = false;
            this.toastr.warning(
              this.translateService.instant("SEARCH_PLACE_FAILED")
            );
          },
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public launchAvailableSources = (): void => {
    this.availableSourcesSubject.next(this.searchPairing.territories);
  };

  public launchSearch = (): void => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    globalConstants.setItem("SOLIGARE_SEARCH", this.searchPairing);
    this.searchSubject.next(this.searchPairing);
  };

  public setSource(selectedAvailableSource: string[]): void {
    if (selectedAvailableSource.length) {
      this.searchPairing.sources = selectedAvailableSource;
      this.launchSearch();
    }
  }

  public setTerritories(selectedTerritories: string[]): void {
    this.searchPairing.territories = selectedTerritories as AnyDepartmentCode[];
    if (selectedTerritories.length) {
      this.launchAvailableSources();
      this.launchSearch();
    }
  }
}
