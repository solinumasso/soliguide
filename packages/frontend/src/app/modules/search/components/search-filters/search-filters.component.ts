import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { type Subject } from "rxjs";

import { ALL_PUBLICS, PUBLICS_LABELS } from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import type { Search, SearchFilterParams } from "../../interfaces";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { InputLanguagesService } from "../../../shared/services/input-languages/input-languages.service";
import type { FilterPillOption } from "../filter-pill-dropdown/filter-pill-dropdown.component";

const toFilterPillOptions = (
  items: ReadonlyArray<{ value: string; name: string }>
): FilterPillOption[] =>
  items
    .filter((item) => item.value !== "all")
    .map((item) => ({ value: item.value, label: item.name }));

@Component({
  selector: "app-search-filters",
  templateUrl: "./search-filters.component.html",
  styleUrls: ["./search-filters.component.css"],
})
export class SearchFiltersComponent implements OnInit {
  @Input({ required: true }) public search: Search;
  @Input({ required: true }) public parcoursSearch: Search;
  @Input({ required: true }) public searchSubject!: Subject<Search>;
  @Input({ required: true }) public parcoursSearchSubject!: Subject<Search>;
  @Input({ required: true }) public filters!: SearchFilterParams;
  @Input({ required: true }) public showFilters: boolean;

  public readonly ALL_PUBLICS = ALL_PUBLICS;
  public readonly PUBLICS_LABELS = PUBLICS_LABELS;

  public readonly administrativeOptions = toFilterPillOptions(
    ALL_PUBLICS.administrative
  );
  public readonly familialleOptions = toFilterPillOptions(
    ALL_PUBLICS.familialle
  );
  public readonly otherOptions = toFilterPillOptions(ALL_PUBLICS.other);
  public languageOptions: FilterPillOption[] = [];

  @Output() public readonly updateFilters = new EventEmitter<void>();

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly posthogService: PosthogService,
    private readonly inputLanguagesService: InputLanguagesService
  ) {
    this.showFilters = false;
  }

  public ngOnInit(): void {
    this.languageOptions = this.buildLanguageOptions();

    this.translateService.onLangChange.subscribe({
      next: () => {
        this.languageOptions = this.buildLanguageOptions();
      },
    });
  }

  private buildLanguageOptions(): FilterPillOption[] {
    return this.inputLanguagesService
      .getLanguagesArray()
      .map((lang) => ({ value: lang.shortLang, label: lang.name }));
  }

  public onLanguageChange(value: string | null): void {
    this.filterString("languages", "", value ?? "");
  }

  public onPublicChange(type: string, value: string | null): void {
    this.filterString(type, "publics", value ?? "");
  }

  public filterString = (type: string, searchPrefix = "", value = ""): void => {
    let _value = value;

    if (type === "age") {
      const input = document.getElementsByName("filterAge")[0];

      if (input.matches(":invalid")) {
        this.toastr.warning(this.translateService.instant("AGE_BAD_VALUE"));
        _value = "";
      }
    }

    if (_value) {
      this.activeFilter(type, searchPrefix, _value);
    } else {
      this.removeFilter(type, searchPrefix);
    }

    this.launchSearch();
  };

  private readonly activeFilter = (
    type: string,
    searchPrefix: string,
    value: string | boolean
  ): void => {
    this.captureEvent(`click-add-filter-${type}`, { newValue: value });
    this.filters[type] = value;

    if (searchPrefix === "") {
      this.search[type] = value;
      this.parcoursSearch[type] = value;
    } else {
      if (typeof this.search[searchPrefix] === "undefined")
        this.search[searchPrefix] = {};

      if (typeof this.parcoursSearch[searchPrefix] === "undefined")
        this.parcoursSearch[searchPrefix] = {};

      if (searchPrefix === "publics") {
        if (
          this.search.publics[type] &&
          typeof this.search.publics[type] === "object"
        ) {
          if (this.search.publics[type].includes(value)) {
            const index = this.search.publics[type].indexOf(value);
            this.search.publics[type].splice(index, 1);
          } else {
            this.search.publics[type].push(value);
          }
        } else {
          this.search.publics[type] = [value];
        }
      } else {
        this.search[searchPrefix][type] = value;
        this.parcoursSearch[searchPrefix][type] = value;
      }
    }
  };

  private readonly removeFilter = (
    type: string,
    searchPrefix: string
  ): void => {
    this.captureEvent(`click-remove-filter-${type}`);
    delete this.filters[type];

    if (searchPrefix === "") {
      delete this.search[type];
      delete this.parcoursSearch[type];
    } else {
      if (typeof this.search[searchPrefix] !== "undefined")
        delete this.search[searchPrefix][type];

      if (typeof this.parcoursSearch[searchPrefix] !== "undefined")
        delete this.parcoursSearch[searchPrefix][type];
    }
  };

  private readonly launchSearch = (): void => {
    this.updateFilters.emit();

    this.router
      .navigate(["."], {
        relativeTo: this.route,
        queryParams: { ...this.filters, placePage: null, parcoursPage: null },
      })
      .then(() => {
        this.searchSubject.next(this.search);
        this.parcoursSearchSubject.next(this.parcoursSearch);
      });
  };

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`search-filters-${eventName}`, {
      ...properties,
      search: this.search,
      parcoursSearch: this.parcoursSearch,
      filters: this.filters,
      showFilters: this.showFilters,
    });
  }
}
