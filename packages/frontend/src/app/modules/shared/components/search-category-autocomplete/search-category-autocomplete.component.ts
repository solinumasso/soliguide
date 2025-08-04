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
  @Input() // Value of placeholder from serach
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

  ngAfterViewInit(): void {
    // Vérifier si le service est déjà initialisé
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
        detachedMediaQuery: "none",
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

    switch (item.type) {
      case AutoCompleteType.CATEGORY:
        iconContent = html`<span
          class="category-icon category-icon-${item.categoryId}_outlined"
          title="Catégorie"
        ></span>`;
        break;
      case AutoCompleteType.EXPRESSION:
        iconContent = html`<img
          src="/assets/images/symbols/expression.svg"
          class="aa-category-icon"
          alt="Expression"
          title="Expression"
        />`;
        break;
      case AutoCompleteType.ESTABLISHMENT_TYPE:
        iconContent = html`<img
          src="/assets/images/symbols/etablishment.svg"
          class="aa-category-icon"
          alt="Type d'établissement"
          title="Type d'établissement"
        />`;
        break;
      case AutoCompleteType.ORGANIZATION:
        iconContent = html`<img
          src="/assets/images/symbols/organization.svg"
          class="aa-category-icon"
          alt="Organisation"
          title="Organisation"
        />`;
        break;
      default:
        iconContent = html`<img
          src="/assets/images/symbols/expression.svg"
          class="aa-category-icon"
          alt="Recherche"
          title="Recherche"
        /> `;
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
