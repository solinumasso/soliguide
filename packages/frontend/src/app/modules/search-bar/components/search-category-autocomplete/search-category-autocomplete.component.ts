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
  AfterViewInit,
  Component,
  type ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { fromEvent, Subscription } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";

import {
  type SearchAutoComplete,
  slugString,
  type Categories,
} from "@soliguide/common";
import type { PosthogProperties } from "@soliguide/common-angular";
import { Search } from "../../../search/interfaces";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { SearchBarService } from "../../services/search-bar.service";

@Component({
  selector: "app-search-category-autocomplete",
  templateUrl: "./search-category-autocomplete.component.html",
  styleUrls: ["./search-category-autocomplete.component.css"],
})
export class SearchCategoryAutocompleteComponent
  implements AfterViewInit, OnDestroy
{
  @Input() public search!: Search;

  @Output()
  public readonly updateCategory = new EventEmitter<void>();

  @Output()
  public readonly updateSearchTerm = new EventEmitter<void>();

  public searching: boolean;
  public showSuggestions: boolean;

  @ViewChild("searchValueInput", { static: true })
  public readonly autoCompleteSearchInput!: ElementRef;

  public autoCompleteResults: SearchAutoComplete;

  private readonly subscription = new Subscription();

  constructor(
    private readonly translateService: TranslateService,
    private readonly searchBarService: SearchBarService,
    private readonly posthogService: PosthogService
  ) {
    this.showSuggestions = false;

    this.autoCompleteResults = {
      categories: [],
      terms: [],
    };
    this.searching = false;
  }

  public ngAfterViewInit() {
    const input$ = fromEvent(
      this.autoCompleteSearchInput.nativeElement,
      "keyup"
    ).pipe(
      debounceTime(500),
      map((event: Event) => {
        return (event.target as HTMLInputElement).value;
      }),
      filter((res) => res.length > 0),
      distinctUntilChanged(),
      switchMap((text) => this.searchBarService.autoComplete(text)),
      tap({
        next: () => {
          this.searching = true;
          this.showSuggestions = true;
        },
      })
    );

    fromEvent(this.autoCompleteSearchInput.nativeElement, "focus")
      .pipe(
        map((event: Event) => {
          return (event.target as HTMLInputElement).value;
        }),
        filter((res) => res.length > 1),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (!this.autoCompleteResults && text) {
          this.searching = true;
          this.showSuggestions = true;
        }
      });

    this.subscription.add(
      input$.subscribe((results: SearchAutoComplete) => {
        this.searching = false;
        this.autoCompleteResults = results;
      })
    );
  }

  public searchCategory = (
    category: Categories,
    keyUsed: "mouse-clicked" | "enter-pressed"
  ) => {
    this.search.category = category;
    this.search.word = null;
    this.search.label = this.translateService.instant(
      this.search.category.toUpperCase()
    );
    this.showSuggestions = false;
    this.updateCategory.emit();
    this.captureEvent(`click-autocomplete-search-category-${category}`, {
      keyUsed,
    });
  };

  public searchWord = (
    word: string | null,
    keyUsed:
      | "mouse-clicked"
      | "enter-pressed"
      | "button-clicked"
      | "input-change"
  ) => {
    if (!word) {
      word = this.autoCompleteSearchInput.nativeElement.value.trim();
    }
    this.search.label = decodeURI(word);
    this.search.word = slugString(word);
    this.search.category = null;
    this.autoCompleteResults = {
      categories: [],
      terms: [],
    };
    this.updateSearchTerm.emit();
    this.showSuggestions = false;
    this.captureEvent("autocomplete-search-word", { keyUsed, word });
  };

  public updateSearchWordOnly = (word: string | null) => {
    this.search.label = decodeURI(word || "");
    this.search.word = slugString(word || "");
  };

  public clearCategoryInput = () => {
    this.search.category = null;
    this.search.label = null;
    this.search.word = null;
    this.autoCompleteSearchInput.nativeElement.focus();
    this.updateSearchTerm.emit();
    this.captureEvent("click-clear-autocomplete");
  };

  @HostListener("document:click", ["$event"])
  public clickout(event: Event) {
    if (!this.autoCompleteSearchInput.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public captureEvent(eventName: string, properties?: PosthogProperties): void {
    this.posthogService.capture(`search-category-autocomplete-${eventName}`, {
      ...properties,
      search: this.search,
      autoCompleteResults: this.autoCompleteResults,
    });
  }
}
