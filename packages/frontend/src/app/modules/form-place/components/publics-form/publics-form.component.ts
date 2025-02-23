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
import { DEFAULT_MODAL_OPTIONS } from "./../../../../shared/constants/DEFAULT_MODAL_OPTIONS.const";
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import {
  ALL_PUBLICS,
  AdminPlaceMenuSteps,
  WelcomedPublics,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { Observable, Subscription } from "rxjs";

import { AdminPlaceService } from "../../services/admin-place.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { ApiError, PUBLICS_KEYS_ERRORS, Place } from "../../../../models";

@Component({
  selector: "app-publics-form",
  templateUrl: "./publics-form.component.html",
})
export class PublicsFormComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public place: Place;

  public loading: boolean;
  public success: boolean;
  public error: boolean;
  public submitted: boolean;

  public oldPublics: string;
  public oldLanguages: string;

  public step: AdminPlaceMenuSteps;

  public typeError: string[];

  @ViewChild("falsyUnconditionalPublic", { static: true })
  public falsyUnconditionalPublic!: TemplateRef<NgbModalRef>;

  constructor(
    private readonly titleService: Title,
    private readonly adminPlaceService: AdminPlaceService,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.loading = false;
    this.submitted = false;
    this.step = "publics";
    this.typeError = [];
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params.lieu_id) {
          const id = params.lieu_id;
          this.subscription.add(
            this.adminPlaceService.getPlace(id).subscribe({
              next: (place: Place) => {
                this.titleService.setTitle(
                  this.translateService.instant("EDITING_WELCOMED_PUBLIC")
                );
                this.place = place;
                this.oldPublics = JSON.stringify(place.publics);
                this.oldLanguages = JSON.stringify(place.languages);
              },
              error: () => {
                this.router.navigate([
                  this.currentLanguageService.routePrefix,
                  "fiche",
                  id,
                ]);
              },
            })
          );
        } else {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "404",
          ]);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private isPublicInvalid = (): boolean => {
    const publics = this.place.publics;

    return (
      publics.accueil !== WelcomedPublics.UNCONDITIONAL &&
      publics.gender.length === ALL_PUBLICS.gender.length - 1 &&
      publics.administrative.length === ALL_PUBLICS.administrative.length - 1 &&
      publics.familialle.length === ALL_PUBLICS.familialle.length - 1 &&
      publics.other.length === ALL_PUBLICS.other.length - 1 &&
      (publics.showAge === false ||
        (publics.age.min === 0 && publics.age.max === 99))
    );
  };

  public chooseUnconditionalPublic = (change: boolean): void => {
    if (change) {
      this.place.publics.accueil = WelcomedPublics.UNCONDITIONAL;
      this.updatePublics();
    } else {
      this.loading = false;
    }

    this.modalService.dismissAll();
  };

  public updatePublics(): void {
    this.loading = true;
    this.submitted = true;
    this.typeError = [];

    if (this.isPublicInvalid()) {
      this.modalService.open(this.falsyUnconditionalPublic, {
        size: "lg",
        ...DEFAULT_MODAL_OPTIONS,
      });
      return;
    }

    this.subscription.add(
      this.adminPlaceService.patchPublics(this.place).subscribe({
        next: (place: Place) => {
          this.loading = false;

          const route = place.stepsDone.conditions
            ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
            : `${this.currentLanguageService.routePrefix}/admin-place/condition/${place.lieu_id}`;
          this.router.navigate([route]);

          this.success = true;
          this.error = true;
          const translatedMessage = this.translateService.instant(
            "UPDATE_SAVED_SUCCESSFULLY"
          );
          this.toastr.success(translatedMessage);
        },
        error: (e: ApiError) => {
          let message = this.translateService.instant(
            "ERROR_OCCURRED_EDITING_PUBLICS"
          );
          this.loading = false;
          this.error = true;
          this.success = false;

          for (const errorMessage of e.error) {
            this.typeError.push(errorMessage.msg);
          }
          for (let i = 0; i < this.typeError.length; i++) {
            if (PUBLICS_KEYS_ERRORS.includes(this.typeError[i])) {
              message = this.translateService.instant(this.typeError[i]);
            }
            this.toastr.error(this.translateService.instant(message));
          }
        },
      })
    );
  }

  public canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away

    return (
      (this.oldPublics === JSON.stringify(this.place?.publics) &&
        this.oldLanguages === JSON.stringify(this.place?.languages)) ||
      this.submitted
    );
  }
}
