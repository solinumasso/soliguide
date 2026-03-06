import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import {
  faLocationDot,
  faMagnifyingGlass,
  faMapPin,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";

import {
  GeoPosition,
  LocationAutoCompleteAddress,
  SoliguideCountries,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  Observable,
  of,
  OperatorFunction,
  switchMap,
  tap,
} from "rxjs";

import { Search } from "../../../../models";

import { globalConstants } from "../../../../shared";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { LocationService } from "../../../iframe-generator/services/location.service";

@Component({
  selector: "app-autocomplete-location",
  templateUrl: "./autocomplete-location.component.html",
  styleUrls: ["./autocomplete-location.component.scss"],
})
export class AutocompleteLocationComponent implements OnInit {
  @Input() public search!: Search;

  @Output()
  public updateLocation = new EventEmitter<void>();

  public searching = false;
  public geolocateLoading = false;
  public searchFailed = false;

  public readonly faSpinner = faSpinner;
  public readonly faMapPin = faMapPin;
  public readonly faLocationDot = faLocationDot;
  public readonly faMagnifyingGlass = faMagnifyingGlass;

  public currentLocationExist: boolean;

  constructor(
    private readonly locationService: LocationService,
    private readonly toastr: ToastrService,
    private readonly posthogService: PosthogService,
    private readonly translateService: TranslateService
  ) {
    this.currentLocationExist = false;
  }

  public ngOnInit(): void {
    this.refreshCurrentLocation();
  }

  public locationAutocomplete: OperatorFunction<
    string,
    readonly LocationAutoCompleteAddress[]
  > = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      filter((term: string) => term.trim().length >= 3),
      switchMap((term: string) =>
        this.getAndFormatAdress(term).pipe(
          tap(() => (this.searchFailed = false)),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

  public formatter = (x: LocationAutoCompleteAddress) => x.label;

  public getAndFormatAdress(
    term: string
  ): Observable<LocationAutoCompleteAddress[]> {
    return this.locationService.locationAutoComplete(term);
  }

  public getLocation = (): void => {
    this.searching = true;
    this.geolocateLoading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position: GeolocationPosition) => {
          this.posthogService.capture("search-around-me", {
            position,
          });

          this.getAddresseFromLocation(position.coords);
        },
        (error: GeolocationPositionError) => {
          this.geolocateLoading = false;
          switch (error.code) {
            case error.TIMEOUT:
              this.toastr.error(
                this.translateService.instant("UNABLE_TO_DETERMINE_POSITION")
              );
              break;
            case error.PERMISSION_DENIED:
              this.toastr.error(
                this.translateService.instant("UNAUTHORIZED_LOCATION")
              );
              break;
            default:
              this.toastr.error(
                this.translateService.instant("UNABLE_TO_DETERMINE_POSITION")
              );
          }
          this.searching = false;
        },
        {
          timeout: 5000,
          maximumAge: 60000,
          enableHighAccuracy: true,
        }
      );
    } else {
      this.searching = false;
      this.toastr.error(this.translateService.instant("UNABLE_TO_LOCATE_YOU"));
    }
  };

  public getAddresseFromLocation(coords: GeolocationCoordinates) {
    const longitude = coords.longitude;
    const latitude = coords.latitude;

    this.locationService.reverse(latitude, longitude).subscribe({
      next: (results: LocationAutoCompleteAddress[]) => {
        this.searching = false;
        this.geolocateLoading = false;
        if (results.length > 0) {
          this.updateSearchLocation(results[0]);
        } else {
          this.toastr.error(
            this.translateService.instant("UNABLE_TO_DETERMINE_POSITION")
          );
        }
      },
      error: () => {
        this.searching = false;
        this.toastr.error(
          this.translateService.instant("UNABLE_TO_DETERMINE_POSITION")
        );
      },
    });
  }

  public selectItem(event: NgbTypeaheadSelectItemEvent) {
    this.updateSearchLocation(event.item as LocationAutoCompleteAddress);
  }

  public refreshCurrentLocation() {
    const currentLocation = globalConstants.getItem("currentLocation");
    if (!currentLocation) {
      globalConstants.setItem("currentLocation", this.search.location);
    } else {
      this.currentLocationExist = true;
    }
  }

  // Mise à jour de l'adresse dans la recherche
  public updateSearchLocation(location: LocationAutoCompleteAddress) {
    if (location) {
      this.search.location = new GeoPosition({
        areas: {
          country: location.country as SoliguideCountries,
          pays: location.country,
          slugs: {
            country: location.country,
            pays: location.country,
          },
        },
        ...location,
      });

      globalConstants.setItem("currentLocation", this.search.location);

      this.currentLocationExist = true;
      this.updateLocation.emit();
    } else {
      this.toastr.error(
        this.translateService.instant("UNABLE_TO_DETERMINE_POSITION")
      );
    }
  }
}
