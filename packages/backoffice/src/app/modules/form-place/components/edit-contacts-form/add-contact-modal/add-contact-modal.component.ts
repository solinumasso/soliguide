import { Component, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import isEmail from "validator/lib/isEmail";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { ToastrService } from "ngx-toastr";

import { map, Observable, of } from "rxjs";

import {
  Organisation,
  SearchOrgaObject,
} from "../../../../admin-organisation/interfaces";
import { InviteUserService } from "../../../../admin-organisation/services/invite-user.service";
import { OrganisationService } from "../../../../admin-organisation/services/organisation.service";
import {
  InvitationFormData,
  PlaceForOrganization,
} from "../../../../admin-organisation/types";

import { User } from "../../../../users/classes";
import { AuthService } from "../../../../users/services/auth.service";
import { Place, THEME_CONFIGURATION } from "../../../../../models";

import { EmailValidator, noWhiteSpace } from "../../../../../shared";
import {
  SearchResults,
  UserRole,
  EMAIL_VALIDATOR_CONFIG,
} from "@soliguide/common";
import { TranslateService } from "@ngx-translate/core";
import { phoneValidator } from "../../../../shared/components/form-phone-input/validators";

@Component({
  selector: "app-add-contact-modal",
  templateUrl: "./add-contact-modal.component.html",
  styleUrls: ["./add-contact-modal.component.css"],
})
export class AddContactModalComponent implements OnInit {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;

  @Input() public place!: Place;

  public inviteForm: UntypedFormGroup;
  public me!: User | null;
  public organisation: Organisation;
  public organisations: Organisation[];
  public places: string[];
  public searchOrgaObject: SearchOrgaObject;

  public loading = false;
  public submitted = false;

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly inviteUserService: InviteUserService,
    private readonly modalService: NgbModal,
    private readonly organisationService: OrganisationService,
    private readonly toastr: ToastrService,
    private readonly translateService: TranslateService
  ) {
    this.place = new Place();
    this.organisation = new Organisation();
    this.organisations = [];
    this.places = [];
  }

  public ngOnInit(): void {
    this.me = this.authService.currentUserValue;
    this.searchOrgaObject = new SearchOrgaObject({}, this.me);
    if (this.me.pro && this.me.currentOrga) {
      this.organisationService.get(this.me.currentOrga._id).subscribe({
        next: (orga: Organisation) => {
          this.organisation = orga;
          this.places = orga.places.map(
            (place: PlaceForOrganization) => place._id
          );
          this.initForm();
        },
        error: () => {
          this.toastr.error(this.translateService.instant("ERROR_TRY_AGAIN"));
          this.close();
        },
      });
    } else if (this.me.admin) {
      this.searchOrgaObject.lieu_id = this.place.lieu_id;
      this.searchOrgaObject.options.limit = null;
      this.searchOrgaObject.options.page = 1;
      this.searchOrgaObject.territories = null;

      this.organisationService.searchOrga(this.searchOrgaObject).subscribe({
        next: (results: SearchResults<Organisation>) => {
          this.organisations = results.results;
          this.organisation = results.results[0];
          this.places = results.results[0].places.map(
            (place: PlaceForOrganization) => place._id
          );
          this.initForm();
        },
        error: () => {
          this.toastr.error(this.translateService.instant("ERROR_TRY_AGAIN"));
          this.close();
        },
      });
    }
  }

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.inviteForm.controls;
  }

  public initForm = (): void => {
    this.inviteForm = this.formBuilder.group({
      lastname: ["", [Validators.required, noWhiteSpace]],
      mail: [
        "",
        [Validators.required, EmailValidator],
        this.validateUniqueEmailInOrga.bind(this),
      ],
      name: ["", [Validators.required, noWhiteSpace]],
      organization: [this.organisation._id, Validators.required],
      organizationName: [
        {
          disabled: true,
          value: this.organisation.name,
        },
        Validators.required,
      ],
      phone: [null, [phoneValidator]],
      role: [UserRole.OWNER, Validators.required],
      title: [],
    });
  };

  public setOrganizationName = (event: Event): void => {
    const orgaObjectId = (event.target as HTMLInputElement).value;
    const selectedOrga = this.organisations.filter(
      (orga: Organisation) => orga._id === orgaObjectId
    )[0];

    if (selectedOrga) {
      this.f.organizationName.setValue(selectedOrga.name);
    }
  };

  public sendInvite = (): void => {
    this.submitted = true;
    if (this.inviteForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      return;
    }

    this.loading = true;

    const invitationForm: InvitationFormData = {
      lastname: this.f.lastname.value,
      mail: this.f.mail.value,
      name: this.f.name.value,
      organization: this.f.organization.value,
      password: "password-to-delete",
      phone: this.f.phone.value,
      places: this.places,
      role: this.f.role.value,
      title: this.f.title.value,
      country: THEME_CONFIGURATION.country,
    };

    this.inviteUserService.sendInvite(invitationForm).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success(
          this.translateService.instant("INVITATION_HAS_BEEN_SENT")
        );
        this.close();
      },
      error: () => {
        this.loading = false;
        this.toastr.error(
          this.translateService.instant("SENDING_INVITATION_NOT_AVAILABLE")
        );
        this.close();
      },
    });
  };

  public close = (): void => {
    this.modalService.dismissAll();
  };

  public validateUniqueEmailInOrga = (
    control: AbstractControl
  ): Observable<{ emailInOrga: boolean }> => {
    if (isEmail(control?.value.trim(), EMAIL_VALIDATOR_CONFIG)) {
      return this.inviteUserService
        .checkEmailAlreadyUsedInOrga(control.value, this.organisation._id)
        .pipe(
          map((res: boolean) => {
            return res === false ? null : { emailInOrga: true };
          })
        );
    }
    return of(null);
  };
}
