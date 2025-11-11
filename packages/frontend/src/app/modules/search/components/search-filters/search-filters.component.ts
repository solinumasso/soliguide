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

import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";
import { type Observable, merge, type Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";

import {
  ALL_PUBLICS,
  PLACE_LANGUAGES_LIST,
  PUBLICS_LABELS,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";

import type { Search, SearchFilterParams } from "../../interfaces";
import type { LanguagesArray } from "../../../../models";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { InputLanguagesService } from "../../../shared/services/input-languages/input-languages.service";

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
  public readonly LANGUAGES_LIST = PLACE_LANGUAGES_LIST;
  public languagesArray: LanguagesArray[];
  public languagesFilterValue: string;

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
    this.languagesArray = [];
    this.languagesFilterValue = "";
  }

  // Search language part
  @ViewChild("languageSearch", { static: true })
  public languageSearch: NgbTypeahead;

  public ngOnInit(): void {
    // Generate Typeahead data
    this.languagesArray = this.inputLanguagesService.getLanguagesArray();

    this.translateService.onLangChange.subscribe({
      next: () => {
        this.languagesArray = this.inputLanguagesService.getLanguagesArray();
      },
    });
  }

  // Search language functions
  public inputFormatter = (currentLanguageFilter: LanguagesArray): string => {
    return currentLanguageFilter.name;
  };

  public searchLanguage = (
    text$: Observable<string>
  ): Observable<LanguagesArray[]> => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );

    return merge(debouncedText$).pipe(
      map((term: string) => {
        this.languagesFilterValue = term;

        if (this.filters.languages) {
          this.filterString("languages", "", "");
        }

        return this.inputLanguagesService.searchLanguage(term);
      })
    );
  };

  public onInputBlur = () => {
    if (
      !this.filters.languages &&
      document.activeElement !== document.getElementById("language-input")
    ) {
      this.languagesFilterValue = "";
    }
  };

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

  public filterBoolean = (type: string, searchPrefix = ""): void => {
    if (this.filters[type]) {
      this.removeFilter(type, searchPrefix);
    } else {
      this.activeFilter(type, searchPrefix, true);
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
