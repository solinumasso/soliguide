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
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ToastrService } from "ngx-toastr";

import { Subscription, concatMap } from "rxjs";

import { ManagePlacesService } from "../../services/manage-places.service";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes/user.class";
import { AuthService } from "../../../users/services/auth.service";

import { Place } from "../../../../models/place/classes/place.class";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-delete-place",
  templateUrl: "./delete-place.component.html",
  styleUrls: ["./delete-place.component.css"],
})
export class DeletePlaceComponent implements OnInit, OnDestroy {
  @Input() public place!: Place;
  private readonly subscription = new Subscription();

  public redirection: string | null;
  public user!: User | null;

  constructor(
    private readonly router: Router,
    private readonly toastr: ToastrService,
    private readonly modalService: NgbModal,
    private readonly authService: AuthService,
    private readonly managePlacesService: ManagePlacesService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.user = null;
    this.redirection = null;
  }

  public ngOnInit(): void {
    this.user = this.authService.currentUserValue;

    if (this.user) {
      this.redirection = this.user?.admin
        ? `${this.currentLanguageService.routePrefix}/manage-place/search`
        : `${this.currentLanguageService.routePrefix}/organisations/edit/${this.user.currentOrga.organization_id}`;
    }

    // Permet de recharger le composant du manage et donc relancer la recherche quand on supprime une fiche afin que la fiche supprimée n'apparaisse plus
    if (this.redirection === this.router.routerState.snapshot.url) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = "reload";
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public cancelDelete(): void {
    this.modalService.dismissAll();
  }

  public deletePlace(): void {
    this.subscription.add(
      this.managePlacesService
        .deletePair(this.place.lieu_id)
        .pipe(
          concatMap(() =>
            this.managePlacesService.deletePlace(this.place.lieu_id)
          )
        )
        .subscribe({
          next: () => {
            this.modalService.dismissAll();
            this.toastr.success(
              this.translateService.instant("DELETION_COMPLETED_SUCCESSFULLY")
            );
            this.router.navigate([this.redirection]);
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("DELETION_COULD_NOT_BE_COMPLETED")
            );
          },
        })
    );
  }
}
