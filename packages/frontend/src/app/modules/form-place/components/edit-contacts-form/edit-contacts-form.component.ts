import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  type TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  type AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import {
  type PlaceContactForAdmin,
  PlaceType,
  UserRole,
} from "@soliguide/common";

import { AdminPlaceService } from "../../services/admin-place.service";
import { AdminPlaceContactsService } from "../../services/admin-place-contacts.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";
import type { UserEdit } from "../../../users/types";

import { THEME_CONFIGURATION, type Place } from "../../../../models";

import { DEFAULT_MODAL_OPTIONS, noWhiteSpace } from "../../../../shared";

@Component({
  selector: "app-edit-contacts-form",
  templateUrl: "./edit-contacts-form.component.html",
  styleUrls: ["./edit-contacts-form.component.css"],
})
export class EditContactsFormComponent implements OnInit, OnDestroy {
  public readonly THEME_CONFIGURATION = THEME_CONFIGURATION;
  private readonly subscription = new Subscription();

  @Input() public place!: Place;

  public placeContacts: PlaceContactForAdmin[];

  public contactsBeforeUpdate: PlaceContactForAdmin[];

  public me!: User | null;

  // Contact en cours d'édition
  public contactToEdit: PlaceContactForAdmin;

  // Formulaire d'édition
  public editContactForm: UntypedFormGroup;

  @ViewChild("addContactModal", { static: true })
  public addContactModal!: TemplateRef<NgbModalRef>;

  public cguStatus = false;
  public loading = false;
  public submitted = false;
  public noChange = true;
  public readonly UserRole = UserRole;

  public MAX_LOADED = 50;
  public nbToDisplay = this.MAX_LOADED;

  public cguChecked = false;

  public routePrefix: string;

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.editContactForm.controls;
  }

  constructor(
    private readonly adminPlaceService: AdminPlaceService,
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly modalService: NgbModal,
    private readonly placeContactsService: AdminPlaceContactsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly toastr: ToastrService,
    private readonly currentLanguageService: CurrentLanguageService,
    private readonly translateService: TranslateService
  ) {
    this.contactsBeforeUpdate = null;
    this.contactToEdit = null;
    this.placeContacts = [];
    this.me = new User();
    this.routePrefix = this.currentLanguageService.routePrefix;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.currentLanguageService.subscribe(
        () => (this.routePrefix = this.currentLanguageService.routePrefix)
      )
    );
    this.me = this.authService.currentUserValue;

    const id = this.route.snapshot.params.lieu_id;

    this.subscription.add(
      this.translateService.onLangChange.subscribe({
        next: () => {
          this.titleService.setTitle(
            this.translateService.instant("BUSINESS_CONTACTS_MODIFICATION", {
              placeName: this.place.name,
            })
          );
        },
      })
    );

    this.subscription.add(
      this.adminPlaceService.getPlace(id, true).subscribe({
        next: (place: Place) => {
          this.place = place;
          this.titleService.setTitle(
            this.translateService.instant("BUSINESS_CONTACTS_MODIFICATION", {
              placeName: this.place.name,
            })
          );

          this.getContactsAdmin();
        },
        error: () => {
          this.router.navigate([
            this.currentLanguageService.routePrefix,
            "place",
            id,
          ]);
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openEditContact = (contact: PlaceContactForAdmin): void => {
    if (!this.cguChecked) {
      this.toastr.warning(
        this.translateService.instant("GIVE_CONSENT_TO_CONTINUE")
      );
      return;
    }

    this.contactToEdit = contact;

    this.editContactForm = this.formBuilder.group({
      lastname: [contact.lastname, [Validators.required, noWhiteSpace]],
      name: [contact.name, [Validators.required, noWhiteSpace]],
      phone: [contact?.phone ?? null, []],
      title: [contact.title],
    });
  };

  // Modification des infos de contact
  public patchPlaceContact = (): void => {
    this.submitted = true;
    this.loading = true;

    if (this.editContactForm.invalid) {
      this.toastr.error(this.translateService.instant("INCORRECT_FIELDS"));
      this.loading = false;
      return;
    }

    const dataToUpdate: Omit<
      UserEdit,
      "mail" | "languages" | "translator" | "territories"
    > = {
      ...this.editContactForm.value,
    };

    this.subscription.add(
      this.placeContactsService
        .updatePlaceContact(this.contactToEdit.userObjectId, dataToUpdate)
        .subscribe({
          next: () => {
            this.contactToEdit = null;
            this.toastr.success(
              this.translateService.instant(
                "YOUR_UPDATE_HAS_BEEN_CORRECTLY_SAVED"
              )
            );
            this.getContactsAdmin();
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("CONTACT_UPDATE_FAIL")
            );
          },
        })
    );
    this.loading = false;
  };

  // Modification de l'affichage
  public patchDisplayContactPro = (
    contact: PlaceContactForAdmin,
    newValue: boolean
  ): void => {
    this.subscription.add(
      this.placeContactsService
        .patchDisplayContactPro(contact._id, newValue)
        .subscribe({
          error: () => {
            this.toastr.error(
              this.translateService.instant("CANNOT_FIND_PLACE")
            );
          },
        })
    );
  };

  public patchContacts = (): void => {
    this.loading = true;

    // On rafraichit la liste des contacts
    this.getContactsAdmin();

    // On ne récupère que les contacts affichés
    const newPlaceContacts = this.placeContacts.filter(
      (placeContact: PlaceContactForAdmin) =>
        placeContact.displayContactPro === true
    );

    if (!this.cguChecked) {
      if (this.contactsBeforeUpdate.length !== newPlaceContacts.length) {
        this.toastr.error(
          this.translateService.instant("GIVE_CONSENT_TO_CONTINUE")
        );
        this.loading = false;
        return;
      }

      const oldContactEmail = this.contactsBeforeUpdate.map(
        (contact: PlaceContactForAdmin) => contact.mail
      );

      const newContactEmail = newPlaceContacts.map(
        (contact: PlaceContactForAdmin) => contact.mail
      );

      for (const oldEmail of oldContactEmail) {
        if (!newContactEmail.includes(oldEmail)) {
          this.toastr.error(
            this.translateService.instant("GIVE_CONSENT_TO_CONTINUE")
          );
          this.loading = false;
          return;
        }
      }
    }

    this.subscription.add(
      this.adminPlaceService
        .patchPlaceContacts(
          this.place.lieu_id,
          this.contactsBeforeUpdate,
          newPlaceContacts,
          this.cguChecked
        )
        .subscribe({
          next: (place: Place) => {
            this.loading = false;

            const route =
              place.placeType === PlaceType.PLACE
                ? place.stepsDone.horaires
                  ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
                  : `${this.currentLanguageService.routePrefix}/admin-place/horaires/${place.lieu_id}`
                : place.stepsDone.publics
                ? `${this.currentLanguageService.routePrefix}/manage-place/${place.lieu_id}`
                : `${this.currentLanguageService.routePrefix}/admin-place/public/${place.lieu_id}`;

            this.router.navigate([route]);
          },
          error: () => {
            this.loading = false;
            this.toastr.error(
              this.translateService.instant("EDIT_CONTACT_ERROR")
            );
          },
        })
    );
  };

  public addNewContact = (): void => {
    this.modalService.open(this.addContactModal, {
      size: "lg",
      ...DEFAULT_MODAL_OPTIONS,
    });
  };

  private readonly getContactsAdmin = (): void => {
    this.subscription.add(
      this.placeContactsService
        .getPlaceContactsForAdmin(this.place.lieu_id)
        .subscribe({
          next: (placeContacts: PlaceContactForAdmin[]) => {
            this.placeContacts = placeContacts;

            // Pour l'historique on récupère la
            if (!this.contactsBeforeUpdate) {
              this.contactsBeforeUpdate = placeContacts.filter(
                (placeContact: PlaceContactForAdmin) =>
                  placeContact.displayContactPro === true
              );
            }
          },
          error: () => {
            this.toastr.error(
              this.translateService.instant("CANNOT_FIND_PLACE")
            );
          },
        })
    );
  };
}
