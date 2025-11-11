/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { autocomplete } from "@algolia/autocomplete-js";
import {
  Subject,
  Subscription,
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  of,
  takeUntil,
  filter,
  take,
  combineLatest,
} from "rxjs";
import {
  faEllipsisH,
  faBuilding,
  faHeart,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

import { Search } from "../../../search/interfaces";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { SearchBarService } from "../../../search-bar/services/search-bar.service";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgIf } from "@angular/common";
import {
  AutoCompleteType,
  Categories,
  SearchSuggestion,
  slugString,
} from "@soliguide/common";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-search-category-autocomplete",
  imports: [NgIf, FontAwesomeModule, TranslateModule],
  standalone: true,
  templateUrl: "./search-category-autocomplete.component.html",
  styleUrls: ["./search-category-autocomplete.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SearchCategoryAutocompleteComponent
  implements OnDestroy, AfterViewInit, OnChanges
{
  @Input() // Value of placeholder from search
  public currentValue: string = "";

  @Input({ required: true })
  public search: Search;

  @Output()
  public readonly updateCategory = new EventEmitter<void>();

  @Output()
  public readonly clearSearch = new EventEmitter<void>();

  @ViewChild("autocompleteContainerCategories", { static: true })
  autocompleteContainerCategories: ElementRef<HTMLElement>;

  public readonly faEllipsisH = faEllipsisH;
  public readonly faBuilding = faBuilding;
  public readonly faHeart = faHeart;
  public readonly faCircleNotch = faCircleNotch;

  public destroy: () => void;
  public setQuery: (value: string) => void;

  public searching = false;
  private readonly subscription = new Subscription();
  private readonly searchCancelSubject = new Subject<void>();

  constructor(
    private readonly searchBarService: SearchBarService,
    private readonly translateService: TranslateService,
    private readonly posthogService: PosthogService
  ) {}
  ngOnDestroy(): void {
    this.searchCancelSubject.next();
    this.searchCancelSubject.complete();
    this.subscription.unsubscribe();
    if (this.destroy) {
      this.destroy();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes?.search && this.setQuery) {
      const currentSearchValue = this.getCurrentSearchValue(
        changes.search.currentValue
      );

      this.setQuery(currentSearchValue);
    }
    if (
      changes?.currentValue &&
      this.setQuery &&
      changes.currentValue.currentValue
    ) {
      this.setQuery(changes.currentValue.currentValue);
    }
  }
  // Check if the service is already initialized
  ngAfterViewInit(): void {
    const searchBarReady$ = this.searchBarService.isReady()
      ? of(true)
      : this.searchBarService.initialization$.pipe(
          filter((isReady) => isReady),
          take(1)
        );

    const translationsReady$ = this.translateService
      .get("PLACEHOLDER_SEARCH")
      .pipe(
        map(() => true),
        take(1)
      );

    combineLatest([searchBarReady$, translationsReady$])
      .pipe(take(1))
      .subscribe(() => {
        console.warn("combine");
        this.setupAutocomplete();
        this.setInitialValue();
      });

    if (!this.searchBarService.isReady()) {
      this.searchBarService.initialize();
    }
  }

  private setInitialValue(): void {
    const inputEl =
      this.autocompleteContainerCategories.nativeElement.querySelector("input");
    const currentValue = this.getCurrentSearchValue(this.search);

    if (inputEl && currentValue) {
      inputEl.value = currentValue;
      if (this.setQuery) {
        this.setQuery(currentValue);
      }
    }
  }

  private getCurrentSearchValue(search: Search): string {
    if (!search) return "";

    if (search.category) {
      return (
        search.label ||
        this.translateService.instant(search.category.toUpperCase())
      );
    } else if (search.word) {
      return search.label || search.word;
    }

    return "";
  }

  private setupAutocomplete(): void {
    const getPlaceholder = () =>
      this.translateService.instant("PLACEHOLDER_SEARCH") || "Rechercher...";

    this.subscription.add(
      this.translateService.onLangChange.subscribe(() => {
        console.log("Changement de langue détecté");
        const inputEl =
          this.autocompleteContainerCategories.nativeElement.querySelector(
            "input"
          );
        if (inputEl) {
          inputEl.placeholder = getPlaceholder();
          console.log("Nouveau placeholder:", inputEl.placeholder);
        }
      })
    );

    if (this.autocompleteContainerCategories) {
      const { destroy, setQuery } = autocomplete({
        placeholder: getPlaceholder(),
        container: this.autocompleteContainerCategories.nativeElement,
        openOnFocus: true,

        onReset: () => {
          this.clearSearch.emit();
        },
        defaultActiveItemId: 0,
        getSources: ({ query }) => this.getSources({ query }),
      });

      this.destroy = destroy;
      this.setQuery = setQuery;

      if (this.currentValue) {
        this.setQuery(this.currentValue);
      }
    }
  }

  private handleSelect(
    item: SearchSuggestion,
    _term: string,
    keyUsed: "mouse-clicked" | "enter-pressed" = "mouse-clicked"
  ) {
    if (item.type === AutoCompleteType.CATEGORY) {
      this.searchCategory(item.categoryId, keyUsed);
    } else {
      this.searchByWord(item, keyUsed);
    }
  }

  private searchCategory(
    category: Categories,
    keyUsed: "mouse-clicked" | "enter-pressed"
  ) {
    this.search.category = category;
    this.search.word = null;
    this.search.label = this.translateService.instant(category.toUpperCase());
    this.updateCategory.emit();
    this.captureEvent(`click-autocomplete-search-category-${category}`, {
      keyUsed,
    });
  }

  private searchByWord(
    item: SearchSuggestion,
    keyUsed: "mouse-clicked" | "enter-pressed"
  ) {
    this.search.category = null;
    this.search.word = item?.slug ?? slugString(item?.label);
    this.search.label = item?.label;
    this.updateCategory.emit();
    this.captureEvent(`click-autocomplete-search-word-${item?.label}`, {
      keyUsed,
    });
  }

  private renderItem({
    item,
    html,
  }: {
    item: SearchSuggestion;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html: any; // skipcq: JS-0323
  }) {
    let iconContent;

    const sourceLogos = `/assets/images/organizations-logos/${THEME_CONFIGURATION.country}`;
    const AVAILABLES_LOGOS = [
      "restos-du-coeur",
      "france-travail",
      "secours-catholique",
      "cruz-roja",
      "secours-populaire",
      "mdm",
      "caf",
      "france-travail",
      "cpam",
      "armee-du-salut",
    ];
    switch (item.type) {
      case AutoCompleteType.CATEGORY:
        {
          iconContent = html`<span
            class="category-icon category-icon-${item.categoryId}_outlined"
            title="Catégorie"
          ></span>`;
        }
        break;
      case AutoCompleteType.EXPRESSION:
        iconContent = html`<span
          class="category-icon category-icon-expression"
          title="Expression"
        ></span>`;
        break;
      case AutoCompleteType.ESTABLISHMENT_TYPE: {
        const hasLogo = AVAILABLES_LOGOS.includes(item.slug);
        if (hasLogo) {
          iconContent = html`<img
            src="${sourceLogos}/${item.slug}.svg"
            class="aa-category-icon"
            alt="Type d'établissement"
            title="Type d'établissement"
          />`;
        } else {
          iconContent = html`<span
            class="category-icon category-icon-accomodation_and_housing"
            title="Type d'établissement"
          ></span>`;
        }
        break;
      }
      case AutoCompleteType.ORGANIZATION: {
        const hasLogo = AVAILABLES_LOGOS.includes(item.slug);
        if (hasLogo) {
          iconContent = html`<img
            src="${sourceLogos}/${item.slug}.svg"
            class="aa-category-icon"
            alt="Organisation"
            title="Organisation"
          />`;
        } else {
          iconContent = html`<span
            class="category-icon category-icon-accomodation_and_housing"
            title="Organisation"
          ></span>`;
        }
        break;
      }
      default:
        iconContent = html`<span
          class="category-icon category-icon-search"
          title="Recherche"
        ></span>`;
        break;
    }

    return html`<button class="aa-ItemLink" type="button">
      <div class="aa-CategoryIcon">${iconContent}</div>
      <div class="aa-ItemContent">
        <div class="aa-ItemContentTitle">${item.label}</div>
      </div>
    </button>`;
  }

  private getSources({ query }: { query: string }) {
    this.searchCancelSubject.next();
    const sanitizedQuery = query.trim();

    if (sanitizedQuery.length === 0) {
      return Promise.resolve([]);
    }

    this.searching = true;

    const sources = [];

    if (sanitizedQuery.length > 0) {
      const suggestions$ = firstValueFrom(
        of(this.searchBarService.autoComplete(sanitizedQuery)).pipe(
          debounceTime(300),
          takeUntil(this.searchCancelSubject),
          catchError(() => {
            this.searching = false;
            return of([]);
          }),
          map((fuseResults) => {
            this.searching = false;
            return fuseResults.slice(0, 10).map((result) => result.item);
          })
        )
      );

      sources.push(
        suggestions$.then((suggestions: SearchSuggestion[]) => {
          const categorySuggestions = suggestions.filter(
            (s) => s.type === AutoCompleteType.CATEGORY
          );
          const establishmentSuggestions = suggestions.filter(
            (s) => s.type === AutoCompleteType.ESTABLISHMENT_TYPE
          );
          const organizationSuggestions = suggestions.filter(
            (s) => s.type === AutoCompleteType.ORGANIZATION
          );

          const allSources = [];

          if (categorySuggestions.length > 0) {
            allSources.push({
              sourceId: "categories-services",
              getItems() {
                return categorySuggestions;
              },
              onSelect: ({ item, event }) => {
                const keyUsed =
                  event.type === "keydown" ? "enter-pressed" : "mouse-clicked";
                this.handleSelect(
                  item as SearchSuggestion,
                  sanitizedQuery,
                  keyUsed
                );
                return (item as SearchSuggestion).label;
              },
              getItemInputValue: ({ item }) => (item as SearchSuggestion).label,
              templates: {
                header: ({ html }) =>
                  html`${this.translateService.instant("CATEGORIES_SERVICES") ||
                  "Catégories & services"}`,
                item: (context) => this.renderItem(context),
              },
            });
          }

          // Source pour "Types d'établissement"
          if (establishmentSuggestions.length > 0) {
            allSources.push({
              sourceId: "establishment-types",
              getItems() {
                return establishmentSuggestions;
              },
              onSelect: ({ item, event }) => {
                const keyUsed =
                  event.type === "keydown" ? "enter-pressed" : "mouse-clicked";
                this.handleSelect(
                  item as SearchSuggestion,
                  sanitizedQuery,
                  keyUsed
                );
                return (item as SearchSuggestion).label;
              },
              getItemInputValue: ({ item }) => (item as SearchSuggestion).label,
              templates: {
                header: ({ html }) =>
                  html`${this.translateService.instant("ESTABLISHMENT_TYPES") ||
                  "Types d'établissement"}`,
                item: (context) => this.renderItem(context),
              },
            });
          }

          // Source pour "Associations & organisations"
          if (organizationSuggestions.length > 0) {
            allSources.push({
              sourceId: "organizations",
              getItems() {
                return organizationSuggestions;
              },
              onSelect: ({ item, event }) => {
                const keyUsed =
                  event.type === "keydown" ? "enter-pressed" : "mouse-clicked";
                this.handleSelect(
                  item as SearchSuggestion,
                  sanitizedQuery,
                  keyUsed
                );
                return (item as SearchSuggestion).label;
              },
              getItemInputValue: ({ item }) => (item as SearchSuggestion).label,
              templates: {
                header: ({ html }) =>
                  html`${this.translateService.instant(
                    "ASSOCIATIONS_ORGANIZATIONS"
                  ) || "Associations & organisations"}`,
                item: (context) => this.renderItem(context),
              },
            });
          }

          return allSources;
        })
      );
    }

    // Ajouter la recherche d'expression à la fin
    if (sanitizedQuery.length > 0) {
      sources.push(
        Promise.resolve([
          {
            sourceId: "expression-search",
            getItems() {
              return [
                {
                  type: AutoCompleteType.EXPRESSION,
                  label: sanitizedQuery,
                  categoryId: null,
                } as SearchSuggestion,
              ];
            },
            onSelect: ({ item, event }) => {
              const keyUsed =
                event.type === "keydown" ? "enter-pressed" : "mouse-clicked";
              this.searchByWord(item, keyUsed);
              return sanitizedQuery;
            },
            getItemInputValue: () => sanitizedQuery,
            templates: {
              item: ({ html }) =>
                html` <button class="aa-ItemLink" type="button">
                  <span class="aa-CategoryIcon">
                    <img
                      src="/assets/images/symbols/list.svg"
                      class="aa-category-icon"
                      alt="Recherche"
                      title="Recherche"
                    />
                  </span>
                  <span class="aa-ItemContent">
                    <span class="aa-ItemContentTitle">${sanitizedQuery}</span>
                  </span>
                </button>`,
              header: ({ html }) =>
                html`${this.translateService.instant("SEARCH_EXPRESSION") ||
                "Recherche libre"}`,
            },
          },
        ])
      );
    }

    // Aplatir les sources
    return Promise.all(sources).then((results) => {
      const flattenedSources = [];
      results.forEach((result) => {
        if (Array.isArray(result)) {
          flattenedSources.push(...result);
        } else {
          flattenedSources.push(result);
        }
      });
      return flattenedSources;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public captureEvent(eventName: string, data?: any) {
    this.posthogService.capture(
      `search-category-autocomplete-${eventName}`,
      data
    );
  }
}
