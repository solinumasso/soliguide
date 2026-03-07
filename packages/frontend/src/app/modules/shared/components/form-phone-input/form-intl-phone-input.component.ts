import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CommonModule, NgIf } from "@angular/common";

import { Subscription } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";

import { Phone } from "@soliguide/common";

import { setFormPhone } from "./functions";
import { THEME_CONFIGURATION } from "../../../../models";
import { PREFERRED_COUNTRIES } from "./constants";
import {
  CountryISO,
  NgxIntlTelInputModule,
  SearchCountryField,
  PhoneNumberFormat as NgxIntlPhoneNumberFormat,
  ChangeData,
} from "ngx-intl-tel-input";

@Component({
  selector: "app-form-intl-phone-input",
  templateUrl: "./form-intl-phone-input.component.html",
  styleUrls: ["./form-intl-phone-input.component.scss"],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgxIntlTelInputModule,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FormIntlPhoneInputComponent implements OnInit {
  @Input() public parentPhoneControl!: AbstractControl;
  @Input() public parentPhoneCountryCode!: AbstractControl;

  @Input() public submitted!: boolean;
  @Input() public phone: Phone;
  @Input() public required: boolean;

  public readonly NgxIntlPhoneNumberFormat = NgxIntlPhoneNumberFormat;
  public readonly SearchCountryField = SearchCountryField;
  public readonly CountryISO = CountryISO;
  public PREFERRED_COUNTRIES: CountryISO[] =
    PREFERRED_COUNTRIES[THEME_CONFIGURATION.country];

  private readonly subscription = new Subscription();

  public phoneForm!: FormGroup;
  public selectedCountryCode: CountryISO;

  public ngOnInit(): void {
    this.selectedCountryCode = this.phone.countryCode as CountryISO;
    if (!this.phoneForm) {
      this.phoneForm = new FormGroup({
        phone: new FormControl(
          {
            number: setFormPhone(this.phone).number,
            countryCode: this.phone?.countryCode ?? THEME_CONFIGURATION.country,
          },
          this.required ? [Validators.required] : []
        ),
      });
    }

    this.subscription.add(
      this.phoneForm.controls.phone.valueChanges.subscribe(
        (value: ChangeData) => {
          if (value) {
            this.parentPhoneControl.setValue(value.nationalNumber);
            this.parentPhoneCountryCode.setValue(value.countryCode);
            this.parentPhoneControl.setErrors(
              this.phoneForm.controls.phone.errors
            );
          }
        }
      )
    );
  }

  public get f(): Record<string, AbstractControl> {
    return this.phoneForm.controls;
  }
}
