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
  MarkerOptions,
  PlacePosition,
  THEME_CONFIGURATION,
} from "../../../../../models";
import {
  UntypedFormGroup,
  AbstractControl,
  Validators,
  UntypedFormBuilder,
} from "@angular/forms";

import { LocationAutoCompleteAddress } from "@soliguide/common";
import { AuthService } from "../../../../users/services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { User } from "../../../../users/classes";

@Component({
  selector: "app-address-input",
  templateUrl: "./address-input.component.html",
  styleUrls: ["./address-input.component.scss"],
})
export class AddressInputComponent implements OnInit {
  @Input() public position: PlacePosition;
  @Input() public additionalInformation: string;

  @Input() public title: string;
  @Input() public titleError: string;
  @Input() public helpAddress: boolean;
  @Input() public helpComplementAddresse: boolean;
  @Input() public addressPlaceholder: string;
  @Input() public additionalInformationPlaceholder: string;
  @Input() public showMap: boolean;
  @Input() public mapIndex: number;

  @Input() public submitted: boolean;

  @Output() public readonly positionChange = new EventEmitter<PlacePosition>();
  @Output() public readonly addressInvalid = new EventEmitter<boolean>();
  @Output() public readonly checkDuplicatePosition =
    new EventEmitter<PlacePosition>();

  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  public positionForm: UntypedFormGroup;
  public readonly addressesOnly = false;

  public marker: MarkerOptions[];

  public me!: User | null;

  public get f(): { [key: string]: AbstractControl } {
    return this.positionForm.controls;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.me = this.authService.currentUserValue;
    this.initForm();
    this.initMarker();
  }

  public initForm = (): void => {
    this.additionalInformation = this.position.additionalInformation;

    this.positionForm = this.formBuilder.group({
      address: [this.position.address, [Validators.required]],
      additionalInformation: [
        this.position.additionalInformation,
        [Validators.maxLength(300)],
      ],
      cityCode: [this.position.cityCode, [Validators.required]],
      city: [this.position.city, [Validators.required]],
      timeZone: [this.position.timeZone, []],
      region: [this.position.region, [Validators.required]],
      regionCode: [this.position.regionCode, [Validators.required]],
      country: [
        this.position.country ?? THEME_CONFIGURATION.country,
        [Validators.required],
      ],
      postalCode: [this.position.postalCode, [Validators.required]],
      department: [this.position.department, [Validators.required]],
      departmentCode: [this.position.departmentCode, [Validators.required]],
      location: [this.position.location, [Validators.required]],
    });
  };

  public updateLocation(item: LocationAutoCompleteAddress) {
    this.position = new PlacePosition({
      // @deprecated start
      adresse: item.label,
      codePostal: item.postalCode,
      complementAdresse: this.additionalInformation,
      departement: item.department,
      departementCode: item.departmentCode,
      pays: item.country,
      ville: item.city,
      // @deprecated end
      additionalInformation: this.additionalInformation,
      address: item.label,
      city: item.city,
      cityCode: item.cityCode,
      regionCode: item.regionCode,
      country: item.country,
      department: item.department,
      postalCode: item.postalCode,
      departmentCode: item.departmentCode,
      location: {
        type: "Point",
        coordinates: item.coordinates,
      },
      region: item?.region,
      timeZone: item?.timeZone,
    });

    this.marker[0].lat = item.coordinates[1];
    this.marker[0].lng = item.coordinates[0];

    this.positionForm.controls.region.setValue(this.position.region);
    this.positionForm.controls.location.setValue(this.position.location);

    this.positionForm.controls.additionalInformation.setValue(
      this.additionalInformation
    );
    this.positionForm.controls.address.setValue(this.position.address);
    this.positionForm.controls.country.setValue(this.position.country);
    this.positionForm.controls.city.setValue(this.position.city);
    this.positionForm.controls.cityCode.setValue(this.position.cityCode);
    this.positionForm.controls.department.setValue(this.position.department);
    this.positionForm.controls.region.setValue(this.position.region);
    this.positionForm.controls.regionCode.setValue(this.position.regionCode);
    this.positionForm.controls.postalCode.setValue(this.position.postalCode);
    this.positionForm.controls.departmentCode.setValue(
      this.position.departmentCode
    );

    this.checkDuplicatePosition.emit(this.position);
    this.addressInvalid.emit(this.positionForm.invalid);

    if (this.positionChange) {
      this.positionChange.emit(this.position);
    }

    this.initMarker();
  }

  public handleNewCoordinates = (newCoord: {
    lat: number;
    lng: number;
  }): void => {
    this.updatePositionFromCoordinates(newCoord);
  };

  private updatePositionFromCoordinates = (newCoord: {
    lat: number;
    lng: number;
  }): void => {
    this.position.location = {
      type: "Point",
      coordinates: [newCoord.lng, newCoord.lat],
    };

    this.marker[0].lat = newCoord.lat;
    this.marker[0].lng = newCoord.lng;

    this.positionForm.controls.location.setValue(this.position.location);

    if (this.positionChange) {
      this.positionChange.emit(this.position);
    }
  };

  private initMarker() {
    this.marker = [
      {
        lng: this.position.location.coordinates[0],
        lat: this.position.location.coordinates[1],
        options: {
          id: 1,
          title: this.translateService.instant("DOT_ON_MAP"),
          icon: {
            url: "../../../../../assets/images/maps/new_pin.svg",
            scaledSize: {
              width: 32,
              height: 44,
            },
          },
        },
      },
    ];
  }

  public clearAddress = (): void => {
    this.position = new PlacePosition();
    this.initForm();
    this.addressInvalid.emit(this.positionForm.invalid);
  };

  public setAdditionalInformation = (event: string): void => {
    this.position.additionalInformation = event;
    this.additionalInformation = event;
  };
}
