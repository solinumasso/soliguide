import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

import {
  ALL_SUPPORTED_LANGUAGES_NAME,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SearchResults,
  SupportedLanguagesCode,
  TranslatedField,
  TranslatedFieldLanguageStatus,
  TranslatedFieldStatus,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Observable, Subscription } from "rxjs";

import { SORT_BY_LANGUAGES, TRANSLATED_FIELDS_PARAMS } from "../../constants";
import { SearchTranslatedFields } from "../../interfaces";
import { TranslationService } from "../../services/translation.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";
import { globalConstants } from "../../../../shared/functions";
import { TranslateService } from "@ngx-translate/core";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-manage-trad-fields",
  templateUrl: "./manage-trad-fields.component.html",
  styleUrls: ["./manage-trad-fields.component.css"],
})
export class ManageTradFieldsComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();

  public routePrefix: string;
  public me!: User | null;

  public loading: boolean;
  public nbResults: number;

  // Api data
  public translatedFields: TranslatedField[];

  // Search parameters
  public search: SearchTranslatedFields;
  public languagesToDisplay: SupportedLanguagesCode[];

  public readonly SORT_BY_LANGUAGES = SORT_BY_LANGUAGES;

  public readonly TRANSLATED_FIELDS_PARAMS = TRANSLATED_FIELDS_PARAMS;
  public readonly ALL_SUPPORTED_LANGUAGES_NAME = ALL_SUPPORTED_LANGUAGES_NAME;
  public readonly AVAILABLE_LANGUAGES_FOR_TRANSLATION =
    SUPPORTED_LANGUAGES_BY_COUNTRY[THEME_CONFIGURATION.country].otherLanguages;

  public readonly TranslatedFieldStatus = TranslatedFieldStatus;
  public readonly TranslatedFieldLanguageStatus = TranslatedFieldLanguageStatus;

  public currentUserSubject$: Observable<User | null>;

  constructor(
    private readonly authService: AuthService,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translationService: TranslationService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.currentUserSubject$ = this.authService.currentUserSubject;
    this.nbResults = 0;

    this.loading = true;
    this.translatedFields = [];
    this.languagesToDisplay = [...this.AVAILABLE_LANGUAGES_FOR_TRANSLATION];

    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("TRANSLATIONS_TO_DO_DASHBOARD")
    );

    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );

    this.subscription.add(
      this.authService.currentUserSubject.subscribe((user: User | null) => {
        if (user) {
          this.languagesToDisplay =
            this.AVAILABLE_LANGUAGES_FOR_TRANSLATION.filter((lang) =>
              user.languages.includes(lang)
            );
          this.search = new SearchTranslatedFields(
            globalConstants.getItem("MANAGE_TRAD_FIELD"),
            user
          );
        }
      })
    );

    this.launchSearch();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public saveSearchParams = (): void => {
    globalConstants.setItem("MANAGE_TRAD_FIELD", this.search);
  };

  public sortBy = (value: string): void => {
    this.search.sort(this.search.options, value);
    this.launchSearch();
  };

  public resetSearchArgument = (key: string): void => {
    this.search.resetSearchElement(key);
    this.launchSearch();
  };

  public launchSearch = (): void => {
    this.loading = true;
    this.saveSearchParams();
    this.translatedFields = [];
    this.subscription.add(
      this.translationService.searchTranslatedFields(this.search).subscribe({
        next: (apiResult: SearchResults<TranslatedField>) => {
          this.translatedFields = apiResult.results;
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
