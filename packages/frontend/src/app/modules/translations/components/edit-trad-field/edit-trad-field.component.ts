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
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  AbstractControl,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {
  ALL_SUPPORTED_LANGUAGES_NAME,
  SUPPORTED_LANGUAGES,
  SupportedLanguagesCode,
  TranslatedField,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";

import { TRANSLATED_FIELDS_PARAMS } from "../../constants";
import { TranslationService } from "../../services/translation.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { CK_EDITOR_CONF, CK_EDITOR_CONF_FR } from "../../../../shared";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-edit-trad-field",
  templateUrl: "./edit-trad-field.component.html",
})
export class EditTradFieldComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;
  // CKEditor
  public editor = ClassicEditor;
  public editorConfig = CK_EDITOR_CONF;

  public editorOrigin = ClassicEditor;
  public editorConfigOrigin = CK_EDITOR_CONF_FR;

  public readonly TRANSLATED_FIELDS_PARAMS = TRANSLATED_FIELDS_PARAMS;
  public readonly ALL_SUPPORTED_LANGUAGES_NAME = ALL_SUPPORTED_LANGUAGES_NAME;

  public typeEditor = "textarea";
  public translatedFieldForm!: UntypedFormGroup;
  public translatedField!: TranslatedField;

  public isAutoTranslation: boolean = true;
  public translatedContent = "";

  public loading = false;
  public lang: SupportedLanguagesCode;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translationService: TranslationService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.lang = SupportedLanguagesCode.EN;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.translatedFieldForm.controls;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params?.id && params?.lang) {
          const id = params.id as string;
          if (SUPPORTED_LANGUAGES.indexOf(params.lang) === -1) {
            this.router.navigate([
              this.currentLanguageService.routePrefix,
              "404",
            ]);
            return;
          }

          this.lang = params.lang as SupportedLanguagesCode;

          this.getTranslatedField(id);
        } else {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "404",
          ]);
        }
      })
    );
  }

  public getTranslatedField(id: string) {
    this.subscription.add(
      this.translationService.findTranslatedField(id).subscribe({
        next: (translatedField: TranslatedField) => {
          this.translatedField = translatedField;

          this.titleService.setTitle(
            this.translateService.instant("TRANSLATE_ELEMENT")
          );

          this.typeEditor =
            TRANSLATED_FIELDS_PARAMS[translatedField.elementName].editor;

          if (
            !translatedField.languages[this.lang].human.content ||
            translatedField.languages[this.lang].human.content === ""
          ) {
            this.translatedContent =
              translatedField.languages[this.lang].auto.content;
            this.isAutoTranslation = true;
          } else {
            this.translatedContent =
              translatedField.languages[this.lang].human.content;
            this.isAutoTranslation = false;
          }

          this.editorConfig.placeholder = this.translateService.instant(
            "TRANSLATION_PROPOSAL"
          );
          this.editorConfig.language = this.lang;

          this.initForm();
        },
        error: () => {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "404",
          ]);
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onReady(editor: ClassicEditor): void {
    editor.editing.view.focus();
  }

  public initForm(): void {
    this.translatedFieldForm = this.formBuilder.group({
      content: [this.translatedContent, [Validators.required]],
      lang: [this.lang, [Validators.required, Validators.minLength(2)]],
    });
  }

  public submitTranslatedField(): void {
    if (this.translatedFieldForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      return;
    }
    this.loading = true;

    const formValue: { content: string; lang: SupportedLanguagesCode } = {
      ...this.translatedFieldForm.value,
    };

    this.subscription.add(
      this.translationService
        .patchTranslatedField(this.translatedField._id, formValue)
        .subscribe({
          next: () => {
            this.loading = false;
            this.toastr.success(
              this.translateService.instant("INFORMATION_SAVED_SUCCESSFULLY")
            );
            this.router.navigate([
              this.currentLanguageService.routePrefix,
              "translations",
            ]);
          },
          error: () => {
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("PLEASE_CHECK_FORM_FIELDS")
            );
          },
        })
    );
  }
}
