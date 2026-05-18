import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { AdminPlaceMenuSteps, PlaceType } from "@soliguide/common";

import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

import { Observable, Subscription } from "rxjs";

import { AdminPlaceService } from "../../services/admin-place.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { Place } from "../../../../models/";

@Component({
  selector: "app-form-place-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class FormMenuPlaceComponent implements OnInit, OnDestroy {
  @Input() public place!: Place;
  @Input() public step!: AdminPlaceMenuSteps;

  private readonly subscription = new Subscription();
  public routePrefix: string;
  public placeInOrga: boolean;
  public readonly PlaceType = PlaceType;

  public currentUserSubject$: Observable<User | null>;

  constructor(
    private readonly toastr: ToastrService,
    private readonly adminPlaceService: AdminPlaceService,
    private readonly authService: AuthService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.currentUserSubject$ = this.authService.currentUserSubject;
    this.placeInOrga = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    if (this.authService.currentUserValue.currentOrga) {
      this.placeInOrga = true;
    } else if (this.place?.lieu_id !== null) {
      this.subscription.add(
        this.adminPlaceService
          .checkInOrga(this.place.lieu_id)
          .subscribe((value: boolean) => {
            this.placeInOrga = value;
          })
      );
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public infoStepNeeded() {
    this.toastr.warning(
      this.translateService.instant("MUST_COMPLETE_THIS_STEP_BEFORE_NEXT")
    );
  }
}
