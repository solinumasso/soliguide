import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import {
  UserRightEditionPayload,
  UserRightStatus,
  UserRightsForOrganizations,
  UserRole,
} from "@soliguide/common";
import { User } from "../../../../users/classes";
import { USER_ROLES_COLORS } from "../../../../users/constants";

import { Router } from "@angular/router";
import { CurrentLanguageService } from "../../../../general/services/current-language.service";
import { Organisation } from "../../../interfaces";
import { Subscription } from "rxjs";
import { OrganisationService } from "../../../services/organisation.service";
import { DEFAULT_MODAL_OPTIONS } from "../../../../../shared";
import { PlaceForOrganization } from "../../../types";

@Component({
  selector: "app-list-roles",
  templateUrl: "./list-roles.component.html",
  styleUrls: ["./list-roles.component.css"],
})
export class ListRolesComponent {
  @Input() public invitation!: boolean;
  @Input() public me!: User | null;
  @Input() public organization!: Organisation;
  @Input() public usersRights!: UserRightsForOrganizations[];

  @Output() public readonly getRolesForOrga = new EventEmitter<void>();

  public oldRoles: UserRightsForOrganizations[];
  public selectedUserToEdit: UserRightEditionPayload;

  public selectedUserToRemove: UserRightsForOrganizations;

  public validForm: boolean;
  public loading: boolean;

  public readonly USER_ROLES_COLORS = USER_ROLES_COLORS;
  public readonly UserRole = UserRole;

  @ViewChild("downgradeMyselfModal", { static: true })
  public downgradeMyselfModal: TemplateRef<NgbModalRef>;

  private readonly subscription = new Subscription();

  constructor(
    private readonly modalService: NgbModal,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly organizationService: OrganisationService
  ) {
    this.invitation = false;
    this.usersRights = [];

    this.selectedUserToEdit = {
      userObjectId: "",
      allPlaces: false,
      isInvitation: false,
      places: [],
      role: UserRole.OWNER,
    };

    this.selectedUserToRemove = null;
    this.validForm = false;
    this.loading = false;
  }

  public changeRole = (): void => {
    if (
      this.me._id === this.selectedUserToEdit.userObjectId &&
      this.me.role &&
      this.me.role === UserRole.OWNER &&
      this.selectedUserToEdit.role !== UserRole.OWNER
    ) {
      this.modalService.open(this.downgradeMyselfModal, DEFAULT_MODAL_OPTIONS);
    }

    this.validForm = true;

    if (
      this.selectedUserToEdit.role === UserRole.EDITOR &&
      this.selectedUserToEdit.places.length === 0
    ) {
      this.selectedUserToEdit.allPlaces = true;
      this.changeAllPlaces(true);
    }
  };

  public initUserToEdit = (user: UserRightsForOrganizations): void => {
    this.selectedUserToRemove = null;

    this.selectedUserToEdit = {
      userObjectId: user.userObjectId,
      allPlaces: user.places.length === this.organization.places.length,
      isInvitation: user.status === UserRightStatus.PENDING,
      places: user.places,
      role: user.role,
    };

    this.validForm =
      (this.selectedUserToEdit.role === UserRole.EDITOR &&
        this.selectedUserToEdit.places.length > 0) ||
      (this.selectedUserToEdit.role !== UserRole.EDITOR &&
        this.selectedUserToEdit.allPlaces);
  };

  public changeAllPlaces = (selected: boolean): void => {
    if (selected) {
      this.selectedUserToEdit.places = this.organization.places.map(
        (place: PlaceForOrganization) => place.lieu_id
      );
      this.validForm = true;
    } else {
      this.selectedUserToEdit.places = [];
      this.validForm = false;
    }
  };

  public addPlaceToRole = (event: Event, lieu_id: number): void => {
    const indexInArray = this.selectedUserToEdit.places.indexOf(lieu_id);
    event.preventDefault();

    if (indexInArray !== -1) {
      this.selectedUserToEdit.places.splice(indexInArray, 1);
    } else {
      this.selectedUserToEdit.places.push(lieu_id);
    }

    if (this.selectedUserToEdit.places.length < 1) {
      this.validForm = false;
      this.toastr.error(
        this.translateService.instant("EDITOR_MUST_EDIT_AT_LEAST_ONE_STRUCTURE")
      );
      return;
    }

    this.selectedUserToEdit.allPlaces =
      this.selectedUserToEdit.places.length === this.organization.places.length;
    this.validForm = true;
  };

  public patchUserRoles = (
    selectedUserToEdit: UserRightEditionPayload
  ): void => {
    this.loading = true;
    if (selectedUserToEdit.role !== UserRole.EDITOR) {
      selectedUserToEdit.allPlaces = true;
      selectedUserToEdit.places = this.organization.places.map(
        (place: PlaceForOrganization) => place.lieu_id
      );
    }

    this.subscription.add(
      this.organizationService
        .patchUserRoles(this.organization._id, selectedUserToEdit)
        .subscribe({
          next: () => {
            this.getRolesForOrga.emit();
            this.loading = false;
            this.selectedUserToEdit = null;
            this.toastr.success(
              this.translateService.instant("ROLE_UPDATED_SUCCESSFULLY")
            );

            if (
              this.me._id === selectedUserToEdit.userObjectId &&
              selectedUserToEdit.role !== UserRole.OWNER
            ) {
              this.modalService.dismissAll();
            }
          },
          error: () => {
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("THERE_WAS_A_PROBLEM")
            );
          },
        })
    );
  };

  public removeUserFromOrga = (user: UserRightsForOrganizations): void => {
    this.loading = true;

    this.subscription.add(
      this.organizationService
        .removeUserFromOrga(user.userObjectId, this.organization._id)
        .subscribe({
          next: () => {
            this.loading = false;
            this.getRolesForOrga.emit();
            this.selectedUserToEdit = null;
            if (user.userObjectId !== this.me._id) {
              this.toastr.success(
                this.translateService.instant("USER_REMOVED_FROM_ORGA", {
                  userName: user.name,
                })
              );
            } else {
              this.modalService.dismissAll();
              this.toastr.success(
                this.translateService.instant(
                  "YOU_HAVE_BEEN_REMOVE_FROM_ORGANIZATION"
                )
              );
              this.router.navigate([this.currentLanguageService.routePrefix]);
            }
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("THERE_WAS_A_PROBLEM")
            );
            this.modalService.dismissAll();
            this.loading = false;
          },
        })
    );
  };
}
