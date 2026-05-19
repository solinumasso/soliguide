import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

import {
  ALL_SUPPORTED_LANGUAGES_NAME,
  SUPPORTED_LANGUAGES,
  SearchResults,
  SortingOrder,
  SupportedLanguagesCode,
  TranslatedPlace,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";

import {
  SORT_BY_LANGUAGES_RATE,
  TRANSLATED_FIELDS_PARAMS,
} from "../../constants";
import { SearchTranslatedPlace } from "../../interfaces";
import { TranslationService } from "../../services/translation.service";
import { SearchTranslatedPlaceSortBy } from "../../types";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import { globalConstants } from "../../../../shared/functions/global-constants.class";

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-manage-trad-places",
  templateUrl: "./manage-trad-places.component.html",
  styleUrls: ["./manage-trad-places.component.css"],
})
export class ManageTradPlacesComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public me!: User | null;

  public loading: boolean;
  public nbResults: number;

  public translatedPlaces: TranslatedPlace[];

  public search!: SearchTranslatedPlace;
  public languagesToDisplay: SupportedLanguagesCode[];

  public readonly TRANSLATED_FIELDS_PARAMS = TRANSLATED_FIELDS_PARAMS;
  public readonly ALL_SUPPORTED_LANGUAGES_NAME = ALL_SUPPORTED_LANGUAGES_NAME;
  public readonly SORT_BY_LANGUAGES_RATE = SORT_BY_LANGUAGES_RATE;

  constructor(
    private readonly authService: AuthService,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translationService: TranslationService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.me = this.authService.currentUserValue;
    this.nbResults = 0;

    this.loading = true;
    this.translatedPlaces = [];

    this.search = new SearchTranslatedPlace(
      globalConstants.getItem("MANAGE_TRANSLATIONS_PLACE"),
      this.me
    );

    this.search.options.sortBy = "translationRate";
    this.search.options.sortValue = SortingOrder.DESCENDING;
    this.routePrefix = this.currentLanguageService.routePrefix;
    this.languagesToDisplay = [...SUPPORTED_LANGUAGES];
  }
  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("TRANSLATED_PLACES_DASHBOARD")
    );

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.subscription.add(
      this.authService.currentUserSubject.subscribe((user: User) => {
        if (user) {
          this.me = user;
          this.languagesToDisplay = user.languages;
        }
      })
    );

    this.search = new SearchTranslatedPlace(
      globalConstants.getItem("MANAGE_TRANSLATIONS_PLACE"),
      this.me
    );

    this.launchSearch();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public saveSearchParams = (): void => {
    globalConstants.setItem("MANAGE_TRANSLATIONS_PLACE", this.search);
  };

  public sortBy = (sortByValue: SearchTranslatedPlaceSortBy): void => {
    this.search.options.sortValue = -this.search.options.sortValue;

    this.search.options.sortBy = sortByValue;
    this.launchSearch();
  };

  public resetSearchArgument = (key: string): void => {
    this.search.resetSearchElement(key);
    this.launchSearch();
  };

  public launchSearch = (): void => {
    this.saveSearchParams();
    this.loading = true;

    this.subscription.add(
      this.translationService.searchTranslatedPlace(this.search).subscribe({
        next: (apiResult: SearchResults<TranslatedPlace>) => {
          this.translatedPlaces = apiResult.results;
          this.nbResults = apiResult.nbResults;
          this.loading = false;

          window.scroll({
            behavior: "smooth",
            left: 0,
            top: 0,
          });
        },
        error: () => {
          this.loading = false;
          this.toastr.error(
            this.translateService.instant("THERE_WAS_A_PROBLEM")
          );
        },
      })
    );
  };
}
