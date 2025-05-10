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
import { Injectable } from "@angular/core";
import { differenceInCalendarDays } from "date-fns";

import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { getMinDateToday, formatEn } from "../../../shared";

@Injectable({
  providedIn: "root",
})
export class DateValidatorService {
  public MIN_DATE_TODAY = getMinDateToday();

  constructor(
    private readonly toastrService: ToastrService,
    private readonly translateService: TranslateService
  ) {}

  public compareDate(d1: Date, d2: Date): boolean {
    if (d1 && d2) {
      if (differenceInCalendarDays(d2, d1) < 0) {
        this.toastrService.error(
          this.translateService.instant(
            "La date de fin doit être après la date de début"
          )
        );
        return false;
      }
    }
    return true;
  }

  // ! @deprecated
  // TODO : supprimer cette validation, implémenter des validateurs directement dans les formulaires
  // Cette fonction sert à valider les données des forms où il y a des dates de début et de fin
  // Notons que le format des dates est Date, car seul le composant start-and-end-form utilise le format ngbDateStruct
  public validDate(
    d1: Date,
    d2: Date,
    both = false,
    hasEndDateMin = true
  ): boolean {
    if (!d1) {
      this.toastrService.error(
        this.translateService.instant("La date de début est obligatoire")
      );
      return false;
    } else {
      if (both) {
        if (!d2) {
          this.toastrService.error(
            this.translateService.instant("La date de fin est obligatoire")
          );
          return false;
        }
      }
      if (d2 && hasEndDateMin && d2 < new Date(formatEn(this.MIN_DATE_TODAY))) {
        this.toastrService.error(
          this.translateService.instant(
            "La date de fin ne doit pas être passée"
          )
        );
        return false;
      }
      return this.compareDate(d1, d2);
    }
  }
}
