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
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { autocomplete } from "@algolia/autocomplete-js";
import {
  Subject,
  Subscription,
  catchError,
  debounceTime,
  firstValueFrom,
  map,
  of,
  takeUntil,
} from "rxjs";
import {
  faCircleNotch,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

import {
  GeoPosition,
  GeoTypes,
  LocationAutoCompleteAddress,
} from "@soliguide/common";

import { Search } from "../../../search/interfaces";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { LocationService } from "../../services";
import { THEME_CONFIGURATION } from "../../../../models";

@Component({
  selector: "app-location-autocomplete",
  templateUrl: "./location-autocomplete.component.html",
  styleUrls: ["./location-autocomplete.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LocationAutocompleteComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  @Input()
  public addressesOnly: boolean; // If true, we don't search for 'poi'

  @Input()
  public currentAddress: string;

  public readonly faLocationDot = faLocationDot;
  public readonly faCircleNotch = faCircleNotch;

  @Output()
  public readonly updateLocation =
    new EventEmitter<LocationAutoCompleteAddress>();

  @Output()
  public readonly clearAddress = new EventEmitter<void>();

  @Input() public search!: Search;

  @ViewChild("autocompleteContainer", { static: true })
  autocompleteContainer: ElementRef<HTMLElement>;

  public destroy: () => void;
  public setQuery: (value: string) => void;

  public locationLoading = false;
  private readonly subscription = new Subscription();

  public currentPosition: LocationAutoCompleteAddress | null;
  private searchCancelSubject = new Subject<void>();

  constructor(
    private readonly locationService: LocationService,
    private readonly translateService: TranslateService,
    private readonly toastr: ToastrService,
    private readonly posthogService: PosthogService
  ) {}

  ngOnDestroy(): void {
    this.searchCancelSubject.next();
    this.searchCancelSubject.complete();
    this.destroy();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes?.currentAddress?.currentValue !==
        changes?.currentAddress?.previousValue &&
      this.setQuery
    ) {
      this.setQuery(changes?.currentAddress?.currentValue);
    }
  }

  ngAfterViewInit(): void {
    const inputEl =
      this.autocompleteContainer.nativeElement.querySelector("input");
    inputEl.setAttribute("data-record", "true");

    if (inputEl && this.currentAddress) {
      inputEl.value = this.currentAddress;
      this.setQuery(this.currentAddress);
    }
  }

  ngOnInit(): void {
    if (this.autocompleteContainer) {
      const { destroy, setQuery } = autocomplete({
        detachedMediaQuery: "none",
        placeholder: THEME_CONFIGURATION.locationAutocompletePlaceholder,
        container: this.autocompleteContainer.nativeElement,
        openOnFocus: true,
        onReset: () => {
          this.clearAddress.emit();
        },
        defaultActiveItemId: 0,
        getSources: ({ query }) => this.getSources({ query }),
      });

      this.destroy = destroy;
      this.setQuery = setQuery;
    }
  }

  private handleSelect(item: LocationAutoCompleteAddress, term: string) {
    const lastPosition = new GeoPosition(item);
    this.posthogService.capture("search-location-autocomplete-term", {
      term,
    });

    this.locationService.localPositionSubject.next(lastPosition);
    this.updateLocation.emit(item);
  }

  private renderItem({
    item,
    html,
  }: {
    item: LocationAutoCompleteAddress;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    html: any; // skipcq: JS-0323
  }) {
    if (item.geoType !== GeoTypes.POSITION) {
      let geoType = this.translateService.instant(
        `GEOTYPE_${item.geoType.toUpperCase()}`
      );
      geoType = geoType.charAt(0).toUpperCase() + geoType.slice(1);
      return html`<button class="aa-ItemLink" type="button">
        <div class="aa-ItemIcon aa-ItemIcon--noBorder">
          <img src="/assets/images/maps/0.png" alt="" />
        </div>
        <div class="aa-ItemContent">
          <div class="aa-ItemContentTitle">
            <b>${geoType}</b> - ${item.label}
          </div>
        </div>
      </button>`;
    } else {
      return html`<button class="aa-ItemLink" type="button">
        <div class="aa-ItemIcon aa-ItemIcon--noBorder">
          <img src="/assets/images/maps/0.png" alt="" />
        </div>
        <div class="aa-ItemContent">
          <div class="aa-ItemContentTitle">${item.label}</div>
        </div>
      </button>`;
    }
  }

  private getSources({ query }: { query: string }) {
    this.searchCancelSubject.next();
    const sanitizedQuery = query.trim().replace(/\//g, " ");

    if (sanitizedQuery.length <= 2) {
      return Promise.resolve([]);
    }

    return firstValueFrom(
      this.locationService
        .locationAutoComplete(sanitizedQuery, this.addressesOnly)
        .pipe(
          debounceTime(300),
          takeUntil(this.searchCancelSubject),
          catchError(() => {
            this.toastr.error(
              this.translateService.instant("IMPOSSIBLE_TO_DETERMINE_LOCATION")
            );
            return of([]);
          }),
          map((predictions: LocationAutoCompleteAddress[]) => {
            return [
              {
                sourceId: "locations",
                getItems() {
                  return predictions;
                },
                onSelect: ({ item }) => {
                  this.handleSelect(
                    item as LocationAutoCompleteAddress,
                    sanitizedQuery
                  );
                  return (item as LocationAutoCompleteAddress).label;
                },
                getItemInputValue: ({ item }) =>
                  (item as LocationAutoCompleteAddress).label,
                templates: {
                  item: (context) => this.renderItem(context),
                },
              },
            ];
          })
        )
    );
  }

  public captureEvent(eventName: string) {
    this.posthogService.capture(`search-location-autocomplete-${eventName}`);
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
                this.setQuery(results[0].label);
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
