import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from "@angular/core";

import { NgbTypeahead } from "@ng-bootstrap/ng-bootstrap";

import type { LanguagesArray } from "../../../../../models";

import { type Observable, merge, Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, map, tap } from "rxjs/operators";
import { CurrentLanguageService } from "../../../../general/services/current-language.service";
import { InputLanguagesService } from "../../../../shared/services/input-languages/input-languages.service";

@Component({
  selector: "app-languages-form-input",
  templateUrl: "./languages-form-input.component.html",
  styleUrls: ["./languages-form-input.component.scss"],
})
export class LanguagesFormInputComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription = new Subscription();
  private readonly destroy$ = new Subject<void>();
  public searchTerm = "";

  @Input() public languages: string[];
  @Output() public readonly languagesChange = new EventEmitter<string[]>();

  // Search language part
  @ViewChild("languageSearch", { static: true })
  public languageSearch: NgbTypeahead;

  public languagesArray: LanguagesArray[];

  public constructor(
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly inputLanguagesService: InputLanguagesService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.languagesArray = this.inputLanguagesService.getLanguagesArray();
      })
    );
    this.languagesArray = this.inputLanguagesService.getLanguagesArray();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscription.unsubscribe();
  }

  public addLanguage = (shortLang: string): void => {
    // Already selected : we unselect it, otherwise we add it to the list
    this.updateLanguages(
      this.languages.includes(shortLang)
        ? this.languages.filter((language) => language !== shortLang)
        : [...this.languages, shortLang]
    );
  };

  /**
   * The languages list is displayed by a child component reading `languages`
   * through an @Input. Angular only refreshes an @Input when its reference
   * changes, so every update must produce a new array instead of mutating
   * the current one, and must be propagated to the parent place.
   */
  private updateLanguages(languages: string[]): void {
    this.languages = languages;
    this.languagesChange.emit(languages);
  }

  // Search language functions
  public inputFormatter = (): string => "";
  // New methods for better UX

  public removeLanguage(shortLang: string): void {
    this.updateLanguages(
      this.languages.filter((language) => language !== shortLang)
    );
  }

  public searchLanguage = (
    text$: Observable<string>
  ): Observable<LanguagesArray[]> => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(() => {
        this.cdr.detectChanges();
      })
    );

    return merge(debouncedText$).pipe(
      map((term: string) => {
        const results = this.inputLanguagesService.searchLanguage(term);

        this.cdr.detectChanges();
        return results;
      })
    );
  };
}
