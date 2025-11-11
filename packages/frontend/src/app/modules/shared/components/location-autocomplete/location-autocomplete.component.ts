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
 */ /*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  Subject,
  Subscription,
  catchError,
  debounceTime,
  of,
  distinctUntilChanged,
  switchMap,
  tap,
  Observable,
} from "rxjs";
import {
  faCircleNotch,
  faLocationDot,
  faMapPin,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

import {
  GeoPosition,
  GeoTypes,
  LocationAutoCompleteAddress,
} from "@soliguide/common";

import { Search } from "../../../search/interfaces";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { LocationService } from "../../services";
import { THEME_CONFIGURATION } from "../../../../models";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgIf } from "@angular/common";
@Component({
  selector: "app-location-autocomplete",
  imports: [
    NgIf,
    FontAwesomeModule,
    TranslateModule,
    NgbTypeaheadModule,
    FormsModule,
  ],
  standalone: true,
  templateUrl: "./location-autocomplete.component.html",
  styleUrls: ["./location-autocomplete.component.scss"],
})
export class LocationAutocompleteComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input()
  public addressesOnly: boolean; // If true, we don't search for 'poi'

  @Input()
  public currentAddress: string = "";
  public readonly faXmark = faXmark;
  public readonly faMapPin = faMapPin;

  public readonly faLocationDot = faLocationDot;
  public readonly faCircleNotch = faCircleNotch;
  public readonly GeoTypes = GeoTypes; // Expose pour le template

  @Output()
  public readonly updateLocation =
    new EventEmitter<LocationAutoCompleteAddress>();

  @Output()
  public readonly clearAddress = new EventEmitter<void>();

  @Input({ required: true }) public search: Search;

  public locationLoading = false;
  public model: string = "";
  public placeholder: string = "";
  private readonly subscription = new Subscription();
  public currentPosition: LocationAutoCompleteAddress | null = null;
  private readonly searchCancelSubject = new Subject<void>();

  constructor(
    private readonly locationService: LocationService,
    private readonly translateService: TranslateService,
    private readonly toastr: ToastrService,
    private readonly posthogService: PosthogService
  ) {}

  ngOnInit(): void {
    this.placeholder =
      THEME_CONFIGURATION.locationAutocompletePlaceholder ||
      this.translateService.instant("LOCATION_PLACEHOLDER");
    this.model = this.currentAddress || "";
  }

  ngOnDestroy(): void {
    this.searchCancelSubject.next();
    this.searchCancelSubject.complete();
    this.subscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.currentAddress?.currentValue !==
      changes?.currentAddress?.previousValue
    ) {
      this.model = changes?.currentAddress?.currentValue || "";
    }
  }

  public searchLocation = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searchCancelSubject.next()),
      switchMap((term) => {
        const sanitizedQuery = term.trim().replace(/\//g, " ");

        if (sanitizedQuery.length <= 2) {
          return of([]);
        }

        return this.locationService
          .locationAutoComplete(sanitizedQuery, this.addressesOnly)
          .pipe(
            catchError(() => {
              this.toastr.error(
                this.translateService.instant(
                  "IMPOSSIBLE_TO_DETERMINE_LOCATION"
                )
              );
              return of([]);
            })
          );
      })
    );

  private handleSelect(item: LocationAutoCompleteAddress, term: string): void {
    const lastPosition = new GeoPosition(item);
    this.posthogService.capture("search-location-autocomplete-term", {
      term,
    });

    this.locationService.localPositionSubject.next(lastPosition);
    this.updateLocation.emit(item);
  }

  public clearLocation(): void {
    this.model = "";
    this.currentPosition = null;
    this.clearAddress.emit();
    this.captureEvent("click-clear-location");
  }
  public formatter = (result: string): string => {
    console.log({ result });
    return result || "";
  };

  public getGeoTypeLabel(geoType: string): string {
    const geoTypeLabel = this.translateService.instant(
      `GEOTYPE_${geoType.toUpperCase()}`
    );
    return geoTypeLabel.charAt(0).toUpperCase() + geoTypeLabel.slice(1);
  }

  public captureEvent(eventName: string): void {
    this.posthogService.capture(`search-location-autocomplete-${eventName}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onSelectItem(event: any): void {
    event.preventDefault();
    const item: LocationAutoCompleteAddress = event.item;
    if (item) {
      this.handleSelect(item, item.label);
    }
  }
  public getCurrentPosition(): void {
    this.captureEvent("click-get-current-position");
    if (typeof navigator.geolocation !== "object") {
      this.toastr.error(this.translateService.instant("UNABLE_TO_LOCATE_YOU"));
      return;
    }

    this.locationLoading = true;

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { longitude, latitude } = position.coords;

        this.subscription.add(
          this.locationService.reverse(latitude, longitude).subscribe({
            next: (results: LocationAutoCompleteAddress[]) => {
              this.locationLoading = false;
              if (results.length) {
                this.handleSelect(results[0], "current-position");
                this.currentPosition = results[0];
              } else {
                this.toastr.error(
                  this.translateService.instant("UNABLE_TO_LOCATE_YOU")
                );
              }
            },
            error: () => {
              this.locationLoading = false;
              this.toastr.error(
                this.translateService.instant("UNABLE_TO_LOCATE_YOU")
              );
            },
          })
        );
      },
      (error: GeolocationPositionError) => {
        this.locationLoading = false;

        if (error.PERMISSION_DENIED) {
          this.toastr.error(
            this.translateService.instant("UNAUTHORIZED_LOCATION")
          );
        } else {
          this.toastr.error(
            this.translateService.instant("UNABLE_TO_LOCATE_YOU")
          );
        }
      },
      {
        timeout: 5000,
        maximumAge: 60000,
        enableHighAccuracy: true,
      }
    );
  }
}
