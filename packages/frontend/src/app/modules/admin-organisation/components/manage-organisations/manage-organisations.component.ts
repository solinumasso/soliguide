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
import { Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { TranslateService } from "@ngx-translate/core";

import {
  AnyDepartmentCode,
  CAMPAIGN_DEFAULT_NAME,
  CommonUser,
  PlaceStatus,
  RELATIONS,
  RELATIONS_SEARCH,
  Relations,
  RelationsSearch,
  SearchResults,
  USER_TYPES,
  USER_TYPES_TO_READABLE,
  UserTypes,
  CAMPAIGN_LIST,
} from "@soliguide/common";

import { ToastrService } from "ngx-toastr";

import { Subscription } from "rxjs";

import { Organisation, SearchOrgaObject } from "../../interfaces";
import { OrganisationService } from "../../services/organisation.service";
import { SearchOrgasSortBy } from "../../types";

import { CurrentLanguageService } from "../../../general/services/current-language.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import {
  ORGA_CAMPAIGN_STATUS,
  OrgaCampaignStatus,
} from "../../../../models/campaign";
import { Place } from "../../../../models/place";

import { fadeInOut } from "../../../../shared/animations";
import {
  campaignIsActiveWithTheme,
  globalConstants,
} from "../../../../shared/functions";
import { DEFAULT_MODAL_OPTIONS } from "../../../../shared";

@Component({
  animations: [fadeInOut],
  selector: "app-manage-organisations",
  templateUrl: "./manage-organisations.component.html",
  styleUrls: ["./manage-organisations.component.css"],
})
export class ManageOrganisationsComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();
  public me!: User | null;
  public organisations!: Organisation[];
  public place: Place;

  public campaignIsActiveForMe: boolean;

  public places: string;
  public orgaToDelete: Organisation;

  public loading: boolean;
  public nbResults: number;

  public search: SearchOrgaObject;

  public readonly CAMPAIGN_NAME = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].name;
  public readonly ORGA_CAMPAIGN_STATUS = ORGA_CAMPAIGN_STATUS;

  public RELATIONS_SEARCH_TO_READABLE: Record<RelationsSearch, string>;
  public readonly RELATIONS = RELATIONS;
  public readonly RELATIONS_SEARCH = RELATIONS_SEARCH;
  public readonly USER_TYPES = USER_TYPES;
  public readonly USER_TYPES_TO_READABLE = USER_TYPES_TO_READABLE;

  public routePrefix: string;

  public readonly OrgaCampaignStatus = OrgaCampaignStatus;
  public readonly PlaceStatus = PlaceStatus;

  constructor(
    private readonly authService: AuthService,
    private readonly modalService: NgbModal,
    private readonly organisationService: OrganisationService,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly currentLanguageService: CurrentLanguageService
  ) {
    this.me = null;
    this.nbResults = 0;
    this.orgaToDelete = null;
    this.loading = true;
    this.organisations = [];
    this.routePrefix = this.currentLanguageService.routePrefix;

    for (const userTypes of Object.keys(USER_TYPES_TO_READABLE)) {
      this.USER_TYPES_TO_READABLE[userTypes] = this.translateService.instant(
        USER_TYPES_TO_READABLE[userTypes]
      );
    }

    this.RELATIONS_SEARCH_TO_READABLE = this.RELATIONS_SEARCH.reduce(
      (acc, relation) => {
        acc[relation] = this.translateService.instant(relation);
        return acc;
      },
      {}
    );
  }

  public ngOnInit(): void {
    this.titleService.setTitle(
      this.translateService.instant("MANAGE_ORGANIZATIONS")
    );
    this.subscription.add(
      this.currentLanguageService.subscribe(() => {
        this.routePrefix = this.currentLanguageService.routePrefix;

        for (const userTypes in USER_TYPES_TO_READABLE) {
          if (
            Object.prototype.hasOwnProperty.call(
              USER_TYPES_TO_READABLE,
              userTypes
            )
          ) {
            this.USER_TYPES_TO_READABLE[userTypes] =
              this.translateService.instant(USER_TYPES_TO_READABLE[userTypes]);
          }
        }

        this.RELATIONS_SEARCH_TO_READABLE = this.RELATIONS_SEARCH.reduce(
          (acc, relation) => {
            acc[relation] = this.translateService.instant(relation);
            return acc;
          },
          {}
        );
      })
    );

    // Récupère les données de l'utilisateur connecté afin d'initialiser la recherche de manière adaptée
    this.me = this.authService.currentUserValue;
    this.campaignIsActiveForMe = campaignIsActiveWithTheme(
      this.me?.territories
    );

    this.search = new SearchOrgaObject(
      globalConstants.getItem("MANAGE_ORGAS"),
      this.me
    );

    this.launchSearch();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public launchSearch(resetPagination?: boolean): void {
    if (resetPagination) {
      this.search.options.page = 1;
    }

    this.loading = true;

    this.search.campaignStatus = Object.keys(ORGA_CAMPAIGN_STATUS).includes(
      this.search.campaignStatus
    )
      ? this.search.campaignStatus
      : null;

    globalConstants.setItem("MANAGE_ORGAS", this.search);

    this.organisationService.searchOrga(this.search).subscribe({
      next: (retour: SearchResults<Organisation>) => {
        this.organisations = retour.results;

        this.nbResults = retour.nbResults;
        this.loading = false;

        window.scroll({
          behavior: "smooth",
          left: 0,
          top: 0,
        });
      },
      error: () => {
        this.loading = false;
        this.toastr.error(this.translateService.instant("THERE_WAS_A_PROBLEM"));
      },
    });
  }

  public setTerritories(selectedTerritories: string[]): void {
    this.search.territories = selectedTerritories as AnyDepartmentCode[];
    this.launchSearch(true);
  }

  public resetSearchArgument = (key: string): void => {
    this.search.resetSearchElement(key);
    this.launchSearch();
  };

  public sortBy(sortByValue: SearchOrgasSortBy): void {
    this.search.sort(this.search.options, sortByValue);
    this.launchSearch(true);
  }

  public updateUserAfterInvitation(retour: {
    index: number;
    updatedUser: CommonUser;
  }): void {
    this.organisations[retour.index].users.push(retour.updatedUser);
  }

  public open(content: TemplateRef<NgbModalRef>, orga: Organisation): void {
    this.orgaToDelete = orga;
    this.modalService.open(content, DEFAULT_MODAL_OPTIONS);
  }

  public deleteOrganisation(): void {
    this.modalService.dismissAll();
    this.organisationService
      .deleteOrganisation(this.orgaToDelete._id)
      .subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success(
            this.translateService.instant("DELETION_COMPLETED_SUCCESSFULLY")
          );
          this.launchSearch();
        },
        error: () => {
          this.loading = false;
          this.toastr.error(
            this.translateService.instant("DELETION_COULD_NOT_BE_COMPLETED")
          );
        },
      });
  }

  public setRelations = (values: string[]) => {
    const relations = values as Relations[];
    this.search.relations = relations;
    this.launchSearch(true);
  };

  public setUserTypes = (values: string[]) => {
    const userTypes = values as UserTypes[];
    this.search.userTypes = userTypes;
    this.launchSearch(true);
  };

  public itemTrackBy(_index: number, item: Organisation) {
    return item.organization_id;
  }
}
