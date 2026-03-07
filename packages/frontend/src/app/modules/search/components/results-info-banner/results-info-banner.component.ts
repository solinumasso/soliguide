import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import {
  type SupportedLanguagesCode,
  Categories,
  type ChildCategory,
  getCategoriesService,
  type LocationAreas,
} from "@soliguide/common";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { environment } from "../../../../../environments/environment";
import { LANGUAGE_FOR_PRACTICAL_FILES, themeService } from "../../../../shared";
import { CurrentLanguageService } from "../../../general/services/current-language.service";

@Component({
  selector: "app-results-info-banner",
  templateUrl: "./results-info-banner.component.html",
})
export class ResultsInfoBannerComponent implements OnInit, OnDestroy {
  @Input() public category!: Categories | null;
  @Input() public areas!: LocationAreas;

  private readonly subscription: Subscription = new Subscription();
  public readonly Categories = Categories;

  public departmentCode: string | null;
  public learningAndEmploymentDepartements: string[];
  public learningAndEmploymentCategories: ChildCategory[];
  public isRelevantForLearningAndEmployment: boolean;
  public howToGetAccommodationLink: string;
  public readonly isThemeSoliguideFr: boolean;

  private currentLang: SupportedLanguagesCode;

  constructor(
    private readonly posthogService: PosthogService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.departmentCode = null;

    // TODO: update this to disable for other countries
    this.learningAndEmploymentDepartements = [
      "13",
      "31",
      "33",
      "35",
      "44",
      "54",
      "59",
      "69",
    ];
    this.learningAndEmploymentCategories =
      getCategoriesService().getFlatCategoryTreeNode(
        Categories.TRAINING_AND_JOBS
      ).children;
    this.isThemeSoliguideFr = themeService.isSoliguideFr();
  }

  public ngOnInit(): void {
    this.currentLang = this.currentLanguageService.currentLanguage;
    this.subscription.add(
      this.currentLanguageService.subscribe((language) => {
        this.currentLang = language;
      })
    );

    if (this.areas?.departmentCode) {
      this.departmentCode = this.areas?.departmentCode;
    }

    this.isRelevantForLearningAndEmployment =
      this.learningAndEmploymentDepartements.includes(this.departmentCode) &&
      this.learningAndEmploymentCategories
        .map((c) => c.id)
        .includes(this.category);

    this.howToGetAccommodationLink = `${environment.praticalFilesLink}/${
      LANGUAGE_FOR_PRACTICAL_FILES[this.currentLang]
    }/19895172153629`;
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public captureEvent(eventName: string) {
    this.posthogService.capture(`search-results-info-banner-${eventName}`, {
      isRelevantForLearningAndEmployment:
        this.isRelevantForLearningAndEmployment,
      departmentCode: this.departmentCode,
      category: this.category,
    });
  }
}
