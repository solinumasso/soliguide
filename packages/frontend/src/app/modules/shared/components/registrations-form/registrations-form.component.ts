import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormGroup,
} from "@angular/forms";
import { NgClass, NgFor, NgIf, UpperCasePipe } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { Subscription } from "rxjs";

import {
  type RegistrationScheme,
  type Registrations,
  type RegistrationsFormValues,
  buildRegistrationsPayload,
  getRegistrationFormSchemesForCountry,
} from "@soliguide/common";

import { THEME_CONFIGURATION } from "../../../../models";

/**
 * One text input per official identifier scheme proposed in forms for the current country (SIRET in France, NIF in Spain...).
 * Schemes accepted by the API but absent from the form (RNA) are left untouched.
 * Writes the `registrations` control of the parent form with the payload expected by the API.
 */
@Component({
  selector: "app-registrations-form",
  templateUrl: "./registrations-form.component.html",
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    UpperCasePipe,
  ],
})
export class RegistrationsFormComponent implements OnInit, OnDestroy {
  /** Must own a `registrations` control */
  @Input({ required: true }) public parentForm!: UntypedFormGroup;
  @Input({ required: true }) public registrations!: Registrations;
  @Input() public submitted = false;

  public readonly schemes: RegistrationScheme[] =
    getRegistrationFormSchemesForCountry(THEME_CONFIGURATION.country);

  public registrationsFormGroup!: FormGroup;

  private readonly subscription = new Subscription();

  public get f(): Record<string, AbstractControl> {
    return this.registrationsFormGroup.controls;
  }

  public ngOnInit(): void {
    const controls: Record<string, FormControl<string | null>> = {};
    for (const scheme of this.schemes) {
      controls[scheme] = new FormControl<string | null>(
        this.registrations?.[scheme]?.value ?? ""
      );
    }
    this.registrationsFormGroup = new FormGroup(controls);

    this.subscription.add(
      this.registrationsFormGroup.valueChanges.subscribe(
        (values: RegistrationsFormValues) => {
          this.parentForm.controls["registrations"]?.setValue(
            buildRegistrationsPayload(this.registrations, values)
          );
          this.parentForm.controls["registrations"]?.markAsDirty();
        }
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
