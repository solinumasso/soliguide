import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Subject, ReplaySubject, Subscription } from "rxjs";

import {
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  AnyDepartmentCode,
  PlaceChangesStatus,
  PlaceChangesSection,
  SearchResults,
  UserStatus,
} from "@soliguide/common";

import { SearchPlaceChanges } from "../../classes";
import { PlaceChangesService } from "../../services/place-changes.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { PlaceChanges } from "../../../../models/place-changes/classes";

import {
  campaignIsActiveWithTheme,
  globalConstants,
} from "../../../../shared/functions";
import { CAMPAIGN_ICONS } from "../../../../models";

@Component({
  selector: "app-manage-place-changes",
  templateUrl: "./manage-place-changes.component.html",
  styleUrls: ["./manage-place-changes.component.css"],
})
export class ManagePlaceChangesComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public search: SearchPlaceChanges;
  public searchSubject: Subject<SearchPlaceChanges> = new ReplaySubject(1);

  public readonly UserStatus = UserStatus;
  public readonly CAMPAIGN_ICON =
    CAMPAIGN_ICONS[CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].icon];
  public readonly PLACE_CHANGES_STATUSES = Object.values(PlaceChangesStatus);
  public readonly PLACE_CHANGES_SECTIONS = Object.values(
    PlaceChangesSection
  ).filter(
    (section) =>
      section !== PlaceChangesSection.CAMPAIGN_SOURCE_MAJ &&
      section !== PlaceChangesSection.place
  );
  public placesChanges: PlaceChanges[];

  public me!: User | null;
  public nbResults: number;
  public loading: boolean;

  public campaignIsActive: boolean;
  public routePrefix: string;

  constructor(
    protected readonly placeChangesService: PlaceChangesService,
    protected readonly authService: AuthService,
    protected readonly titleService: Title,
    protected readonly toastr: ToastrService,
    protected readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.loading = true;
    this.placesChanges = [];

    this.nbResults = 0;

    this.campaignIsActive = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
    this.me = this.authService.currentUserValue;

    this.search = new SearchPlaceChanges(
      globalConstants.getItem("MANAGE_PLACE_CHANGES"),
      this.me
    );
  }

  public ngOnInit(): void {
    // Fetch the connected user data in order to adequatly initialize the search
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.campaignIsActive = campaignIsActiveWithTheme(this.me?.territories);
    this.titleService.setTitle(this.translateService.instant("MANAGE_UPDATES"));
    this.searchSubject.next(this.search);

    //
    // Launch the search
    //
    this.subscription.add(
      this.searchSubject.subscribe({
        next: (search: SearchPlaceChanges) => {
          this.loading = true;

          globalConstants.setItem("MANAGE_PLACE_CHANGES", this.search);

          this.subscription.add(
            this.placeChangesService.searchPlaceChanges(search).subscribe({
              next: (response: SearchResults<PlaceChanges>) => {
                this.placesChanges = response.results;
                this.nbResults = response.nbResults;
                this.loading = false;
              },
              error: () => {
                this.loading = false;
                this.toastr.error(
                  this.translateService.instant("SEARCH_ERROR")
                );
              },
            })
          );
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public setTerritories(selectedTerritories: string[]): void {
    this.search.territories = selectedTerritories as AnyDepartmentCode[];
    this.launchSearch();
  }

  public resetSearchArgument = (key: string): void => {
    this.search.resetSearchElement(key);
    this.launchSearch();
  };

  public launchSearch = (resetPagination?: boolean): void => {
    if (resetPagination) {
      this.search.options.page = 1;
    }
    this.searchSubject.next(this.search);
  };

  public sortBy = (value: string): void => {
    this.search.sort(this.search.options, value);
    this.launchSearch();
  };
}
