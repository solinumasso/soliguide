import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { AdminPlaceMenuSteps, Modalities } from "@soliguide/common";

import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { Observable, Subscription } from "rxjs";

import { AdminPlaceService } from "../../services/admin-place.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { Place } from "../../../../models/place/classes";

@Component({
  selector: "app-modalities",
  templateUrl: "./modalities.component.html",
  styleUrls: ["./modalities.component.css"],
})
export class ModalitiesComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public routePrefix: string;
  public step: AdminPlaceMenuSteps;

  public loading: boolean;
  public submitted: boolean;

  public oldModalities: Modalities;

  public place: Place;

  constructor(
    private readonly titleService: Title,
    private readonly adminPlaceService: AdminPlaceService,
    private readonly route: ActivatedRoute,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.step = "modalities";
    this.submitted = false;
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.subscription.add(
      this.route.params.subscribe((params) => {
        if (params.lieu_id) {
          const id = params.lieu_id;
          this.subscription.add(
            this.adminPlaceService.getPlace(id, true).subscribe({
              next: (place: Place) => {
                this.titleService.setTitle(
                  this.translateService.instant("EDITING_PLACE_ACCESS_TERMS")
                );
                this.place = place;

                this.oldModalities = JSON.parse(
                  JSON.stringify(place.modalities)
                );
              },
              error: () => {
                this.router.navigate([
                  this.currentLanguageService.routePrefix,
                  "fiche",
                  id,
                ]);
              },
            })
          );
        } else {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "404",
          ]);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public updateModalities() {
    this.submitted = true;
    this.loading = true;

    this.subscription.add(
      this.adminPlaceService
        .patchModalities(this.place.lieu_id, this.place.modalities)
        .subscribe({
          next: (place: Place) => {
            this.loading = false;

            this.toastr.success(
              this.translateService.instant("ACCESS_TERMS_UPDATE_SUCCESS")
            );
            const route = place.stepsDone.services
              ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
              : `${this.currentLanguageService.routePrefix}/admin-place/services/${place.lieu_id}`;
            this.router.navigate([route]);
          },
          error: () => {
            this.loading = false;
            this.submitted = false;

            this.toastr.error(
              this.translateService.instant("CHECK_PLACE_ACCESS_TERMS_SELECTED")
            );
          },
        })
    );
  }

  public canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm alert before navigating away
    return (
      JSON.stringify(this.oldModalities) ===
        JSON.stringify(this.place?.modalities) || this.submitted
    );
  }
}
