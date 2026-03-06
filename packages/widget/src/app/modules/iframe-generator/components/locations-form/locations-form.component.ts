import { Component, Input } from "@angular/core";

import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { GeoTypes, LocationAutoCompleteAddress } from "@soliguide/common";

import { GEO_TYPES_TO_LOCATION_TYPE } from "../../constants";
import { AnalyticsService } from "../../services/analytics.service";
import { IframeFormType, LocationType, IframeGeneratorStep } from "../../types";

@Component({
  selector: "app-locations-form",
  templateUrl: "./locations-form.component.html",
  styleUrls: [
    "./locations-form.component.scss",
    "../iframe-form/iframe-form.component.scss",
  ],
})
export class LocationsFormComponent {
  @Input() public formValue!: IframeFormType;

  public readonly faTimes = faTimes;
  public readonly LocationType = LocationType;
  public readonly GeoTypes = GeoTypes;

  constructor(private readonly analyticsService: AnalyticsService) {}

  public updateLocation = async (
    geoType: GeoTypes,
    location: LocationAutoCompleteAddress
  ) => this.addRemoveLocation(location, GEO_TYPES_TO_LOCATION_TYPE[geoType]);

  public addRemoveLocation = async (
    newLocation: LocationAutoCompleteAddress,
    locationType?: LocationType
  ) => {
    await this.analyticsService.capture(
      `update-location-${locationType}`,
      IframeGeneratorStep.LOCATIONS,
      this.formValue,
      { newLocation }
    );
    if (this.formValue.national) {
      return;
    }

    if (!locationType) {
      throw new Error("WRONG_LOCATION_TYPE");
    }

    if (
      this.formValue[locationType].find(
        (location: LocationAutoCompleteAddress) =>
          location.geoValue === newLocation.geoValue
      )
    ) {
      this.formValue[locationType].splice(
        this.formValue[locationType].findIndex(
          (location) => location.geoValue === newLocation.geoValue
        ),
        1
      );
    } else {
      this.formValue[locationType].push(newLocation);
    }
  };

  public toggleNational = async () => {
    await this.analyticsService.capture(
      "toggle-national",
      IframeGeneratorStep.LOCATIONS,
      this.formValue
    );
    this.formValue.national = !this.formValue.national;
  };
}
