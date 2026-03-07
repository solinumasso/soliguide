import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Title } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import {
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  PlaceChangesSection,
  PlaceChangesStatus,
  UserStatus,
} from "@soliguide/common";

import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { PlaceChangesService } from "../../services/place-changes.service";
import { DisplayChangesAdminPlaceComponent } from "../display-changes-admin-place/display-changes-admin-place.component";
import { CAMPAIGN_ICONS, Place } from "../../../../models";

import { AuthService } from "../../../users/services/auth.service";
import { AdminPlaceService } from "../../../form-place/services/admin-place.service";
import { SearchPlaceChanges } from "../../classes";
import { User } from "../../../users/classes";

@Component({
  selector: "app-place-history",
  templateUrl: "./place-history.component.html",
  styleUrls: ["./place-history.component.scss"],
})
export class PlaceHistoryComponent
  extends DisplayChangesAdminPlaceComponent
  implements OnInit
{
  public readonly UserStatus = UserStatus;
  public readonly CAMPAIGN_ICON =
    CAMPAIGN_ICONS[CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].icon];
  public readonly PLACE_CHANGES_STATUSES = Object.values(PlaceChangesStatus);
  public readonly PLACE_CHANGES_SECTIONS = Object.values(PlaceChangesSection);
  public currentUserSubject$: Observable<User | null>;

  constructor(
    protected override readonly placeChangesService: PlaceChangesService,
    protected override readonly toastr: ToastrService,
    protected override readonly currentLanguageService: CurrentLanguageService,
    protected override readonly route: ActivatedRoute,
    protected override readonly translateService: TranslateService,
    protected override readonly authService: AuthService,
    protected readonly titleService: Title,
    private readonly adminPlaceService: AdminPlaceService,
    private readonly router: Router
  ) {
    super(
      placeChangesService,
      toastr,
      currentLanguageService,
      route,
      translateService,
      authService
    );
    this.currentUserSubject$ = this.authService.currentUserSubject;
  }

  override ngOnInit() {
    const placeId = this.route.snapshot.params.lieu_id;

    this.subscription.add(
      this.adminPlaceService.getPlace(placeId, true).subscribe({
        next: (place: Place) => {
          this.titleService.setTitle(
            `${this.translateService.instant("HISTORY_OF_A_PLACE")} ${
              place.name
            }`
          );
          this.place = place;

          this.search = new SearchPlaceChanges(
            { userData: { status: null } },
            this.authService.currentUserValue
          );

          this.launchSearch();
          this.search.options.limit = 10;
        },
        error: () => {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "fiche",
            placeId,
          ]);
        },
      })
    );
  }
}
