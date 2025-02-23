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
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
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
    // Does not exist, we add to the list
    if (!this.languages.includes(shortLang)) {
      this.languages.push(shortLang);
    }
    // If exists : we delete
    else {
      this.languages.splice(this.languages.indexOf(shortLang), 1);
    }
  };

  // Search language functions
  public inputFormatter = (): string => "";
  // New methods for better UX

  public removeLanguage(shortLang: string): void {
    const index = this.languages.indexOf(shortLang);
    if (index !== -1) {
      this.languages.splice(index, 1);
      this.cdr.detectChanges();
    }
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
