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
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
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
import { LocationService } from "../../../../shared/services/location.service";
import { TranslateService } from "@ngx-translate/core";
import { User } from "../../../../users/classes";
import { Subscription } from "rxjs";

@Component({
  selector: "app-address-input",
  templateUrl: "./address-input.component.html",
  styleUrls: ["./address-input.component.scss"],
})
export class AddressInputComponent implements OnInit, OnDestroy {
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
  public manualMode = false;
  public mapHintVisible = true;
  public manualStreetDisplay = "";

  public marker: MarkerOptions[];

  public me!: User | null;

  private readonly subscription = new Subscription();
  private isUpdatingFromAutocomplete = false;

  public get f(): { [key: string]: AbstractControl } {
    return this.positionForm.controls;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly locationService: LocationService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.me = this.authService.currentUserValue;
    this.initForm();
    this.initMarker();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      latitude: [
        this.position.location?.coordinates?.[1] ?? null,
        [Validators.min(-90), Validators.max(90)],
      ],
      longitude: [
        this.position.location?.coordinates?.[0] ?? null,
        [Validators.min(-180), Validators.max(180)],
      ],
    });
  };

  public updateLocation(item: LocationAutoCompleteAddress) {
    this.isUpdatingFromAutocomplete = true;
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
    this.positionForm.controls.latitude.setValue(item.coordinates[1]);
    this.positionForm.controls.longitude.setValue(item.coordinates[0]);

    this.isUpdatingFromAutocomplete = false;

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
    this.mapHintVisible = false;
    this.marker = [{ ...this.marker[0], lat: newCoord.lat, lng: newCoord.lng }];

    // Try reverse geocoding to find an approximate address at the pin location
    this.subscription.add(
      this.locationService.reverse(newCoord.lat, newCoord.lng).subscribe({
        next: (results: LocationAutoCompleteAddress[]) => {
          if (results?.length) {
            this.updatePositionFromReverseGeocode(results[0], newCoord);
          } else {
            this.updatePositionFromCoordinates(newCoord);
          }
        },
        error: () => {
          this.updatePositionFromCoordinates(newCoord);
        },
      })
    );
  };

  private updatePositionFromReverseGeocode(
    result: LocationAutoCompleteAddress,
    coord: { lat: number; lng: number }
  ): void {
    this.isUpdatingFromAutocomplete = true;

    // Keep GPS at the user's dragged pin position, not at the reverse geocoded address
    const location = {
      type: "Point",
      coordinates: [coord.lng, coord.lat],
    };

    if (this.manualMode) {
      this.manualStreetDisplay = result.name ?? result.label;
    }

    this.position = new PlacePosition({
      // @deprecated start
      adresse: result.label,
      codePostal: result.postalCode,
      complementAdresse: this.additionalInformation,
      departement: result.department,
      departementCode: result.departmentCode,
      pays: result.country,
      ville: result.city,
      // @deprecated end
      additionalInformation: this.additionalInformation,
      address: result.label,
      city: result.city,
      cityCode: result.cityCode,
      regionCode: result.regionCode,
      country: result.country,
      department: result.department,
      postalCode: result.postalCode,
      departmentCode: result.departmentCode,
      region: result.region,
      timeZone: result.timeZone,
      location,
    });

    this.positionForm.controls.location.setValue(location);
    this.positionForm.controls.address.setValue(this.position.address);
    this.positionForm.controls.city.setValue(this.position.city);
    this.positionForm.controls.cityCode.setValue(this.position.cityCode);
    this.positionForm.controls.postalCode.setValue(this.position.postalCode);
    this.positionForm.controls.department.setValue(this.position.department);
    this.positionForm.controls.departmentCode.setValue(
      this.position.departmentCode
    );
    this.positionForm.controls.region.setValue(this.position.region);
    this.positionForm.controls.regionCode.setValue(this.position.regionCode);
    this.positionForm.controls.country.setValue(this.position.country);
    this.positionForm.controls.timeZone.setValue(this.position.timeZone);
    this.positionForm.controls.latitude.setValue(coord.lat);
    this.positionForm.controls.longitude.setValue(coord.lng);

    this.isUpdatingFromAutocomplete = false;

    this.addressInvalid.emit(this.positionForm.invalid);

    if (this.positionChange) {
      this.positionChange.emit(this.position);
    }
  }

  private updatePositionFromCoordinates = (newCoord: {
    lat: number;
    lng: number;
  }): void => {
    this.position.location = {
      type: "Point",
      coordinates: [newCoord.lng, newCoord.lat],
    };

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

  public updateStreetOnly(item: LocationAutoCompleteAddress): void {
    this.isUpdatingFromAutocomplete = true;
    this.mapHintVisible = false;

    this.manualStreetDisplay = item.name ?? item.label;
    const location = { type: "Point", coordinates: item.coordinates };

    this.position.address = item.label;
    this.position.location = location;
    if (item.city) this.position.city = item.city;
    if (item.cityCode) this.position.cityCode = item.cityCode;
    if (item.postalCode) this.position.postalCode = item.postalCode;
    if (item.department) this.position.department = item.department;
    if (item.departmentCode) this.position.departmentCode = item.departmentCode;
    if (item.region) this.position.region = item.region;
    if (item.regionCode) this.position.regionCode = item.regionCode;
    if (item.country) this.position.country = item.country;
    if (item.timeZone) this.position.timeZone = item.timeZone;

    this.positionForm.controls.address.setValue(item.label);
    this.positionForm.controls.location.setValue(location);
    if (item.city) this.positionForm.controls.city.setValue(item.city);
    if (item.cityCode)
      this.positionForm.controls.cityCode.setValue(item.cityCode);
    if (item.postalCode)
      this.positionForm.controls.postalCode.setValue(item.postalCode);
    this.positionForm.controls.latitude.setValue(item.coordinates[1]);
    this.positionForm.controls.longitude.setValue(item.coordinates[0]);
    if (item.department)
      this.positionForm.controls.department.setValue(item.department);
    if (item.departmentCode)
      this.positionForm.controls.departmentCode.setValue(item.departmentCode);
    if (item.region) this.positionForm.controls.region.setValue(item.region);
    if (item.regionCode)
      this.positionForm.controls.regionCode.setValue(item.regionCode);
    if (item.country) this.positionForm.controls.country.setValue(item.country);
    if (item.timeZone)
      this.positionForm.controls.timeZone.setValue(item.timeZone);

    this.marker = [
      { ...this.marker[0], lat: item.coordinates[1], lng: item.coordinates[0] },
    ];

    this.isUpdatingFromAutocomplete = false;

    this.positionChange.emit(this.position);
    this.addressInvalid.emit(this.positionForm.invalid);
  }

  public clearStreetField(): void {
    this.manualStreetDisplay = "";
    this.position.address = "";
    this.position.postalCode = "";
    this.position.city = "";
    this.position.department = "";
    this.position.region = "";
    this.positionForm.controls.address.setValue("", { emitEvent: false });
    this.positionForm.controls.postalCode.setValue("", { emitEvent: false });
    this.positionForm.controls.city.setValue("", { emitEvent: false });
    this.positionForm.controls.department.setValue("", { emitEvent: false });
    this.positionForm.controls.region.setValue("", { emitEvent: false });
    this.positionChange.emit(this.position);
    this.addressInvalid.emit(this.positionForm.invalid);
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

  public setManualMode = (manual: boolean): void => {
    this.manualMode = manual;
    if (manual) {
      this.manualStreetDisplay = this.position.address ?? "";
      this.positionForm.controls.latitude.setValue(
        this.position.location?.coordinates?.[1] ?? null
      );
      this.positionForm.controls.longitude.setValue(
        this.position.location?.coordinates?.[0] ?? null
      );
      this.subscription.add(
        this.positionForm.valueChanges.subscribe(() => {
          if (this.isUpdatingFromAutocomplete) return;
          const city = this.positionForm.controls.city.value || "";
          const postalCode = this.positionForm.controls.postalCode.value || "";
          const cityPart = [postalCode, city].filter(Boolean).join(" ");
          const fullAddress = [this.manualStreetDisplay, cityPart]
            .filter(Boolean)
            .join(", ");
          if (fullAddress) {
            this.position.address = fullAddress;
            this.positionForm.controls.address.setValue(fullAddress, {
              emitEvent: false,
            });
          }
          this.position.city = city;
          this.position.postalCode = postalCode;
          this.position.additionalInformation =
            this.positionForm.controls.additionalInformation.value;
          this.position.country = this.positionForm.controls.country.value;
          this.positionChange.emit(this.position);
          this.addressInvalid.emit(this.positionForm.invalid);
        })
      );
    }
  };

  public onManualCoordinatesChange = (): void => {
    const lat = this.positionForm.controls.latitude.value;
    const lng = this.positionForm.controls.longitude.value;

    if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
      return;
    }

    if (this.marker?.[0]) {
      this.marker = [{ ...this.marker[0], lat, lng }];
    }

    const location = {
      type: "Point",
      coordinates: [lng, lat],
    };
    this.positionForm.controls.location.setValue(location);
    this.position.location = location;

    this.subscription.add(
      this.locationService.reverse(lat, lng).subscribe({
        next: (results: LocationAutoCompleteAddress[]) => {
          if (results?.length) {
            const result = results[0];
            this.positionForm.controls.department.setValue(result.department);
            this.positionForm.controls.departmentCode.setValue(
              result.departmentCode
            );
            this.positionForm.controls.region.setValue(result.region);
            this.positionForm.controls.regionCode.setValue(result.regionCode);
            this.positionForm.controls.timeZone.setValue(result.timeZone);
            this.position.department = result.department;
            this.position.departmentCode = result.departmentCode;
            this.position.region = result.region;
            this.position.regionCode = result.regionCode;
            this.position.timeZone = result.timeZone;
          }
          this.positionChange.emit(this.position);
          this.addressInvalid.emit(this.positionForm.invalid);
        },
        error: () => {
          this.positionChange.emit(this.position);
          this.addressInvalid.emit(this.positionForm.invalid);
        },
      })
    );
  };
}
