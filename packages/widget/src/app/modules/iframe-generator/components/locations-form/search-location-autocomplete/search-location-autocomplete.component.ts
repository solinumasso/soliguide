import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from "@angular/core";

import { fromEvent } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from "rxjs/operators";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { GeoTypes, LocationAutoCompleteAddress } from "@soliguide/common";

import { LocationService } from "../../../services/location.service";

@Component({
  selector: "app-search-location-autocomplete",
  templateUrl: "./search-location-autocomplete.component.html",
  styleUrls: ["./search-location-autocomplete.component.scss"],
})
export class SearchLocationAutocompleteComponent implements AfterViewInit {
  @Input() public geoType!: GeoTypes;
  @Input() public label: string;
  @Input() public placeholder: string;
  @Input() public disabled: boolean;

  @Output()
  public readonly updateLocation =
    new EventEmitter<LocationAutoCompleteAddress>();

  public searchTerm: string;
  public searching: boolean;
  public showSuggestions: boolean;
  public readonly GeoTypes = GeoTypes;

  @ViewChild("searchValueInput", { static: true })
  public autocompleteLocationInput!: ElementRef;

  public autocompleteResults: LocationAutoCompleteAddress[];

  public readonly faTimes = faTimes;

  constructor(private readonly locationService: LocationService) {
    this.searchTerm = "";
    this.showSuggestions = false;

    this.autocompleteResults = [];
    this.searching = false;

    this.label = "";
    this.placeholder = "";

    this.disabled = false;
  }

  public ngAfterViewInit() {
    const input$ = fromEvent<Event>(
      this.autocompleteLocationInput.nativeElement,
      "keyup"
    ).pipe(
      debounceTime(50),
      map((event: Event) => {
        return (event.target as HTMLInputElement).value;
      }),
      filter((term: string) => term.trim().length >= 3),
      distinctUntilChanged(),
      switchMap((text) =>
        this.locationService.locationAutoComplete(text, this.geoType)
      ),
      tap({
        next: () => {
          this.searching = true;
          this.showSuggestions = true;
        },
      })
    );

    fromEvent<Event>(this.autocompleteLocationInput.nativeElement, "focus")
      .pipe(
        map((event: Event) => {
          return (event.target as HTMLInputElement).value;
        }),
        filter((res) => res.length > 1),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (!this.autocompleteResults && text) {
          this.searching = true;
          this.showSuggestions = true;
        }
      });

    input$.subscribe((results: LocationAutoCompleteAddress[]) => {
      this.searching = false;
      this.autocompleteResults = results;
    });
  }

  public addLocation = (location: LocationAutoCompleteAddress) => {
    this.autocompleteResults = [];
    this.searchTerm = "";
    this.updateLocation.emit(location);
  };

  public clearCategoryInput = () => {
    this.searchTerm = "";
    this.autocompleteResults = [];
  };

  @HostListener("document:click", ["$event"])
  public clickout(event: Event) {
    if (!this.autocompleteLocationInput.nativeElement.contains(event.target)) {
      this.showSuggestions = false;
    }
  }
}
