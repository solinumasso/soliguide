import { Component, Input } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import {
  ALL_PUBLICS,
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  AllPublicsElements,
  Publics,
  PublicsElement,
  PublicsOther,
  WelcomedPublics,
} from "@soliguide/common";

@Component({
  selector: "app-form-type-publics-fiche",
  templateUrl: "./type-publics.component.html",
  styleUrls: [
    "./type-publics.component.css",
    "../../../styles/shared-form-place.css",
  ],
})
export class FormTypePublicsFicheComponent {
  @Input() public publics!: Publics;
  @Input() public isFiche!: boolean; // Pour distinguer des conditions dans un service et dans une fiche
  @Input() public index!: number; // Pour donner un id différent aux éléments du public dans les services
  @Input() public typeError!: string[]; // Pour savoir quelle erreur il y a eue

  public readonly ALL_PUBLICS = ALL_PUBLICS;

  public readonly PublicsElement = PublicsElement;
  public readonly PublicsOther = PublicsOther;
  public readonly WelcomedPublics = WelcomedPublics;

  public constructor(private readonly translateService: TranslateService) {}

  public setDefaultPublics = (): void => {
    this.publics.accueil = WelcomedPublics.UNCONDITIONAL;
    this.publics.administrative = [...ADMINISTRATIVE_DEFAULT_VALUES];
    this.publics.age = { max: 99, min: 0 };
    this.publics.familialle = [...FAMILY_DEFAULT_VALUES];
    this.publics.gender = [...GENDER_DEFAULT_VALUES];
    this.publics.other = [...OTHER_DEFAULT_VALUES];
  };

  public setPreferential = (
    typeAccueil: WelcomedPublics.PREFERENTIAL | WelcomedPublics.EXCLUSIVE
  ): void => {
    if (this.publics.accueil === WelcomedPublics.UNCONDITIONAL) {
      this.setDefaultPublics();
    }
    this.publics.accueil = typeAccueil;
  };

  public selectAll = (element: PublicsElement): void => {
    if (this.publics[element].length !== this.ALL_PUBLICS[element].length - 1) {
      this.publics[element] = [];
      for (let i = 1; i < this.ALL_PUBLICS[element].length; i++) {
        this.publics[element].push(this.ALL_PUBLICS[element][i].value as never);
      }
    } else {
      this.publics[element] = [];
    }
  };

  public getStringToDisplay = (element: PublicsElement): string => {
    let displayValue = "";
    if (this.publics[element].length === this.ALL_PUBLICS[element].length - 1) {
      return this.translateService.instant(ALL_PUBLICS[element][0].name);
    } else if (this.publics[element].length === 0) {
      return "Aucun";
    }

    this.ALL_PUBLICS[element].forEach(
      (tmp: { name: string; value: AllPublicsElements }) => {
        if (this.publics[element].includes(tmp.value as never)) {
          displayValue =
            displayValue.length !== 0
              ? displayValue.concat(
                  ", ",
                  this.translateService.instant(tmp.name)
                )
              : displayValue.concat(this.translateService.instant(tmp.name));
        }
      }
    );

    return displayValue;
  };

  public toggleCheckboxButton = (
    publicElement: PublicsElement,
    value: AllPublicsElements
  ): void => {
    const index = this.publics[publicElement].indexOf(value as never);

    if (index !== -1) {
      this.publics[publicElement].splice(index, 1);
    } else {
      this.publics[publicElement].push(value as never);
    }
  };

  public resetAge = (showAge: boolean) => {
    if (!showAge) {
      this.publics.age.min = 0;
      this.publics.age.max = 99;
    }
  };
}
