import { Component, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { JsonPipe, NgClass, NgIf } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { Subscription } from "rxjs";

import { Phone, REGEXP } from "@soliguide/common";

import { SharedModule } from "../../shared.module";
import { THEME_CONFIGURATION } from "../../../../models";
import { FormIntlPhoneInputComponent } from "../form-phone-input/form-intl-phone-input.component";

@Component({
  selector: "app-form-phone-input",
  templateUrl: "./form-phone-input.component.html",
  styleUrls: ["./form-phone-input.component.css"],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    JsonPipe,
    SharedModule,
    TranslateModule,
    NgClass,
    FormIntlPhoneInputComponent,
  ],
})
export class FormPhoneInputComponent implements OnInit {
  @Input() public parentForm: FormGroup;
  @Input() public phone: Phone;
  @Input() public phoneLabelPlaceholder: string;
  @Input() public submitted: boolean;
  @Input() public index = 0;

  @Input() public needLabel = false;

  private readonly subscription = new Subscription();

  public phoneFormGroup: FormGroup;

  public get f(): {
    [key: string]: AbstractControl;
  } {
    return this.parentForm.controls;
  }

  public ngOnInit(): void {
    if (!this.phone) {
      this.phone = {
        isSpecialPhoneNumber: false,
        countryCode: THEME_CONFIGURATION.country,
        label: null,
        phoneNumber: null,
      };
    }

    this.phoneFormGroup = new FormGroup({
      label: new FormControl(this.phone.label, [
        Validators.maxLength(100),
        Validators.minLength(3),
      ]),
      phoneNumber: new FormControl(
        this.phone.phoneNumber,
        this.phone.isSpecialPhoneNumber
          ? [Validators.pattern(REGEXP.phone)]
          : []
      ),
      countryCode: new FormControl(
        this.phone?.countryCode ?? THEME_CONFIGURATION.country,
        []
      ),
      isSpecialPhoneNumber: new FormControl(
        this.phone.isSpecialPhoneNumber,
        []
      ),
    });

    this.subscription.add(
      this.phoneFormGroup.valueChanges.subscribe((value: Phone) => {
        this.parentForm.controls["phone"].setValue(value);
        this.parentForm.setErrors(
          this.phoneFormGroup.valid ? null : { phoneIsNotValid: true }
        );
      })
    );
  }

  public patchPhoneFormValidators() {
    const isSpecialPhoneNumber = this.phoneFormGroup.get(
      "isSpecialPhoneNumber"
    )?.value;

    const labelIsNotEmpty = this.phoneFormGroup.get("label")?.value?.length > 2;

    const validators = labelIsNotEmpty ? [Validators.required] : [];
    if (isSpecialPhoneNumber) {
      validators.push(Validators.pattern(REGEXP.phone));
    }

    this.phoneFormGroup.get("phoneNumber")?.setValidators(validators);
    this.phoneFormGroup.get("phoneNumber")?.updateValueAndValidity();
  }
}
