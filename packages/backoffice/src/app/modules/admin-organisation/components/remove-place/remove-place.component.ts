import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";

import { Organisation } from "../../interfaces/organisation.interface";
import { OrganisationService } from "../../services/organisation.service";
import { PlaceForOrganization } from "../../types/PlaceForOrganization.type";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-remove-place",
  templateUrl: "./remove-place.component.html",
  styleUrls: ["./remove-place.component.css"],
})
export class RemovePlaceComponent implements OnInit, OnDestroy {
  @Input() public fromPlace!: boolean;
  @Input() public orga!: Organisation;
  @Input() public place!: PlaceForOrganization;

  private readonly subscription = new Subscription();
  public user: User | null;
  public redirection: string[];
  public loading: boolean;

  constructor(
    private readonly organisationService: OrganisationService,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.user = null;
    this.loading = false;
    this.redirection = [];
  }

  public ngOnInit(): void {
    if (this.fromPlace) {
      this.user = this.authService.currentUserValue;

      this.subscription.add(
        this.currentLanguageService.subscribe(() => {
          this.redirection = this.user.admin
            ? [
                this.currentLanguageService.routePrefix,
                "manage-place",
                "search",
              ]
            : [
                this.currentLanguageService.routePrefix,
                "organisations",
                `${this.user.currentOrga.organization_id}`,
              ];
        })
      );
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public cancelRemoval = (): void => {
    this.modalService.dismissAll();
  };

  public removePlace = (): void => {
    this.loading = true;
    this.subscription.add(
      this.organisationService
        .removePlaceFromOrga(this.orga._id, this.place.lieu_id)
        .subscribe({
          next: () => {
            this.loading = false;
            this.modalService.dismissAll();
            this.toastr.success(
              this.translateService.instant("STRUCTURE_REMOVAL_SUCCESS")
            );
            if (this.fromPlace) {
              this.router.navigate(this.redirection);
            } else {
              window.location.reload();
            }
          },
          error: () => {
            this.toastr.error(this.translateService.instant("ERROR_TRY_AGAIN"));
          },
        })
    );
  };
}
