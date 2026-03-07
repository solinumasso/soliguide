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
