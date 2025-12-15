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
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import {
  PUBLICS_LABELS,
  ModalitiesElement,
  PublicsElement,
  CountryCodes,
  LocationAutoCompleteAddress,
} from "@soliguide/common";

import { IframeFormType, IframeGeneratorStep } from "../../types";

import { AnalyticsService } from "../../services/analytics.service";

import { WidgetThemeProperties } from "../../../../models";

import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-uri-display",
  templateUrl: "./uri-display.component.html",
  styleUrls: ["./uri-display.component.scss"],
})
export class UriDisplayComponent implements OnInit {
  public uri: string;
  public searchUri: string;

  public readonly PUBLICS_LABELS = PUBLICS_LABELS;

  @Input() public formValue!: IframeFormType;
  @Output() public restart = new EventEmitter<void>();

  constructor(private readonly analyticsService: AnalyticsService) {
    this.uri = "";
    this.searchUri = `${environment.widgetUrl}/search/SOLINUM/fr/none?`;
  }

  public async ngOnInit() {
    this.generateUri();
    await this.analyticsService.capture(
      "display-uri",
      IframeGeneratorStep.URI,
      this.formValue,
      { generatedUri: this.uri }
    );
  }

  private generateUri = (): void => {
    if (this.formValue.national) {
      this.searchUri += `geoValueCountries=${CountryCodes.FR}`;
    } else if (this.formValue.regions.length) {
      this.searchUri += this.addLocationQueryParameter(
        "geoValueRegions",
        this.formValue.regions.entries(),
        this.searchUri[this.searchUri.length - 1]
      );
    } else if (this.formValue.departments.length) {
      this.searchUri += this.addLocationQueryParameter(
        "geoValueDepartments",
        this.formValue.departments.entries(),
        this.searchUri[this.searchUri.length - 1]
      );
    } else if (this.formValue.cities.length) {
      this.searchUri += this.addLocationQueryParameter(
        "geoValueCities",
        this.formValue.cities.entries(),
        this.searchUri[this.searchUri.length - 1]
      );
    }

    if (this.formValue.categories.length) {
      this.searchUri += this.addNumberOrStringQueryParameter(
        "categories",
        this.formValue.categories.entries(),
        this.searchUri[this.searchUri.length - 1]
      );
    }

    if (this.formValue.publics) {
      for (const publicsElement in this.formValue.publics) {
        if (
          (this.formValue.publics[publicsElement as PublicsElement] as string[])
            .length <
          Object.values(this.PUBLICS_LABELS[publicsElement as PublicsElement])
            .length -
            1
        ) {
          this.searchUri += this.addNumberOrStringQueryParameter(
            publicsElement,
            (
              this.formValue.publics[
                publicsElement as PublicsElement
              ] as string[]
            ).entries(),
            this.searchUri[this.searchUri.length - 1]
          );
        }
      }
    }

    if (
      this.formValue.modalities &&
      Object.entries(this.formValue.modalities).length <
        Object.entries(ModalitiesElement).length - 1
    ) {
      const modalitiesType: ModalitiesElement[] = [];

      for (const modalitiesElement in this.formValue.modalities) {
        if (modalitiesElement !== ModalitiesElement.ANIMAL) {
          if (
            modalitiesElement !== ModalitiesElement.PRICE &&
            modalitiesElement !== ModalitiesElement.PRM
          ) {
            modalitiesType.push(modalitiesElement as ModalitiesElement);
          } else {
            if (this.searchUri[this.searchUri.length - 1] !== "?") {
              this.searchUri += "&";
            }

            this.searchUri +=
              modalitiesElement +
              "=" +
              this.formValue.modalities[modalitiesElement];
          }
        }
      }

      if (modalitiesType.length < 4) {
        for (const modalitiesElement of modalitiesType) {
          if (this.searchUri[this.searchUri.length - 1] !== "?") {
            this.searchUri += "&";
          }

          this.searchUri +=
            modalitiesElement +
            "=" +
            this.formValue.modalities[modalitiesElement];
        }
      }
    }

    for (const themeProperty in this.formValue.theme) {
      if (this.searchUri[this.searchUri.length - 1] !== "?")
        this.searchUri += "&";
      this.searchUri +=
        themeProperty +
        "=" +
        this.formValue.theme[themeProperty as WidgetThemeProperties].slice(1);
    }

    this.uri = `<iframe aria-label="Soliguide" height="380px" style="width: 100%; display: block; margin: 0 auto" title="Widget Soliguide" frameborder="0" src="${this.searchUri}"></iframe>`;
  };

  private addLocationQueryParameter = (
    locationQueryParameter: string,
    values: IterableIterator<[number, LocationAutoCompleteAddress]>,
    lastCharacter: string
  ) => {
    let partialUri = lastCharacter !== "?" ? "&" : "";

    partialUri += locationQueryParameter + "=";

    for (const [index, value] of values) {
      if (index) partialUri += ",";
      partialUri += value.geoValue;
    }

    return partialUri;
  };

  private addNumberOrStringQueryParameter = (
    numberOrStringQueryParameter: string,
    values: IterableIterator<[number, number | string]>,
    lastCharacter: string
  ) => {
    let partialUri = lastCharacter !== "?" ? "&" : "";

    partialUri += numberOrStringQueryParameter + "=";

    for (const [index, value] of values) {
      if (index) partialUri += ",";
      partialUri += value;
    }

    return partialUri;
  };
}
