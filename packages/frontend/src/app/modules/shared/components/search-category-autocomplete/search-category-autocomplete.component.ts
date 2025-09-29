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
  public search!: Search;

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

  private readonly AVAILABLES_LOGOS = [
    "restos-du-coeur",
    "france-travail",
    "secours-catholique",
    // "croix-rouge",
    "cruz-roja",
    "secours-populaire",
    // "emmaus",
    "caf",
    "france-travail",
    // "france-services",
    //  "cimade",
    //  "cidff",
    //  "adil",
    "cpam",
    "pimms",
    "armee-du-salut",
    // "banque-alimentaire",
  ];

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
    if (changes?.search && this.setQuery) {
      const currentSearchValue = this.getCurrentSearchValue(
        changes.search.currentValue
      );

      this.setQuery(currentSearchValue);
    }
  }
  // Check if the service is already initialized
  ngAfterViewInit(): void {
    if (this.searchBarService.isReady()) {
      this.setupAutocomplete();
      this.setInitialValue();
    } else {
      this.searchBarService.initialization$
        .pipe(
          filter((isReady) => isReady),
          take(1)
        )
        .subscribe(() => {
          this.setupAutocomplete();
          this.setInitialValue();
        });

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
    if (this.autocompleteContainerCategories) {
      const { destroy, setQuery } = autocomplete({
        detachedMediaQuery: "",
        placeholder:
          this.translateService.instant("SEARCH_PLACEHOLDER") ||
          "Rechercher...",
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

    switch (item.type) {
      case AutoCompleteType.CATEGORY: {
        const hasSvgLogo = this.AVAILABLES_LOGOS.includes(item.categoryId);

        if (hasSvgLogo) {
          const categoryLogoPath = `/assets/images/categories/${item.categoryId}.svg`;
          iconContent = html`<img
            src="${categoryLogoPath}"
            class="aa-category-icon"
            alt="Catégorie"
            title="Catégorie"
          />`;
        } else {
          iconContent = html`<span
            class="category-icon category-icon-${item.categoryId}_outlined"
            title="Catégorie"
          ></span>`;
        }
        break;
      }
      case AutoCompleteType.EXPRESSION:
        iconContent = html`<span
          class="category-icon category-icon-expression"
          title="Expression"
        ></span>`;
        break;
      case AutoCompleteType.ESTABLISHMENT_TYPE: {
        const hasLogo = this.AVAILABLES_LOGOS.includes(item.slug);
        if (hasLogo) {
          iconContent = html`<img
            src="${sourceLogos}/${item.slug}.svg"
            class="aa-category-icon"
            alt="Type d'établissement"
            title="Type d'établissement"
          />`;
        } else {
          iconContent = html`<span
            class="category-icon category-icon-establishment"
            title="Type d'établissement"
          ></span>`;
        }
        break;
      }
      case AutoCompleteType.ORGANIZATION: {
        const hasLogo = this.AVAILABLES_LOGOS.includes(item.slug);
        if (hasLogo) {
          iconContent = html`<img
            src="${sourceLogos}/${item.slug}.svg"
            class="aa-category-icon"
            alt="Organisation"
            title="Organisation"
          />`;
        } else {
          iconContent = html`<span
            class="category-icon category-icon-organization"
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
            return fuseResults.slice(0, 6).map((result) => result.item);
          })
        )
      );

      sources.push(
        suggestions$.then((suggestions: SearchSuggestion[]) => ({
          sourceId: "suggestions",
          getItems() {
            return suggestions;
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
            item: (context) => this.renderItem(context),
          },
        }))
      );
    }

    if (sanitizedQuery.length > 0) {
      sources.push(
        Promise.resolve({
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
            item: ({ html }) => html`<button class="aa-ItemLink" type="button">
              <div class="aa-CategoryIcon">
                <span class="aa-icon-wrapper">
                  <img
                    src="/assets/images/symbols/list.svg"
                    class="aa-category-icon"
                    alt="Recherche"
                    title="Recherche"
                  />
                </span>
              </div>
              <div class="aa-ItemContent">
                <div class="aa-ItemContentTitle">${sanitizedQuery}</div>
              </div>
            </button>`,
            header: ({ html }) =>
              html`<div class="aa-SourceHeader">
                ${this.translateService.instant("SEARCH_EXPRESSION")}
              </div>`,
          },
        })
      );
    }

    return Promise.all(sources);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public captureEvent(eventName: string, data?: any) {
    this.posthogService.capture(
      `search-category-autocomplete-${eventName}`,
      data
    );
  }
}
