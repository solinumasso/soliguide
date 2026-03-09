import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import {
  PlaceChangesStatus,
  SearchResults,
  getTerritoryAndCountryFromPlace,
} from "@soliguide/common";
import { SearchPlaceChanges } from "../../classes";
import { PlaceChangesService } from "../../services/place-changes.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { Place } from "../../../../models/place/classes";
import { PlaceChanges } from "../../../../models/place-changes/classes";
import { THEME_CONFIGURATION } from "../../../../models";
import { AuthService } from "../../../users/services/auth.service";

@Component({
  selector: "app-display-changes-admin-place",
  templateUrl: "./display-changes-admin-place.component.html",
  styleUrls: ["./display-changes-admin-place.component.css"],
})
export class DisplayChangesAdminPlaceComponent implements OnInit, OnDestroy {
  protected readonly subscription = new Subscription();
  @Input() public place!: Place;

  public changes: PlaceChanges[];
  public routePrefix: string;
  public nbResults: number;
  public loading: boolean;
  public search: SearchPlaceChanges;
  public readonly PlaceChangesStatus = PlaceChangesStatus;
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  constructor(
    protected readonly placeChangesService: PlaceChangesService,
    protected readonly toastr: ToastrService,
    protected readonly currentLanguageService: CurrentLanguageService,
    protected readonly route: ActivatedRoute,
    protected readonly translateService: TranslateService,
    protected readonly authService: AuthService
  ) {
    this.changes = [];
    this.loading = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.search = new SearchPlaceChanges(
      { userData: { status: null } },
      this.authService.currentUserValue
    );
    this.search.options.limit = 5;

    this.launchSearch();
  }

  public launchSearch(): void {
    const placeId = this.place
      ? this.place.lieu_id
      : this.route.snapshot.params.lieu_id;

    const light = !!this.place;
    this.search.lieu_id = placeId;

    const { territory } = getTerritoryAndCountryFromPlace(this.place);

    this.search.territories = [territory];

    this.subscription.add(
      this.placeChangesService
        .searchPlaceChangesForPlace(placeId, this.search, light)
        .subscribe({
          next: (response: SearchResults<PlaceChanges>) => {
            this.loading = false;
            this.changes = response.results;
            this.nbResults = response.nbResults;
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("THERE_WAS_A_PROBLEM")
            );
          },
        })
    );
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
