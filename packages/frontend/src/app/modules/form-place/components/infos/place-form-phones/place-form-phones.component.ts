import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

import { Phone, REGEXP } from "@soliguide/common";
import { THEME_CONFIGURATION } from "../../../../../models";
import { phoneValidator } from "../../../../shared/components/form-phone-input/validators";

@Component({
  selector: "app-place-form-phones",
  templateUrl: "./place-form-phones.component.html",
  styleUrls: ["./place-form-phones.component.css"],
})
export class PlaceFormPhonesComponent implements OnInit {
  @Input() public parentForm: FormGroup;
  @Input() public phonesData: Phone[];
  @Input() public phonesForm: FormArray;
  @Input() public phoneLabelPlaceholder: string;
  @Input() public submitted: boolean;

  public get f(): FormArray {
    return this.parentForm.get("phones") as FormArray;
  }

  public ngOnInit(): void {
    this.initPhones();
  }

  public patchPhoneFormValidators(index: number) {
    const isSpecialPhoneNumber = this.phonesForm?.controls[index].get(
      "isSpecialPhoneNumber"
    )?.value;
    const labelIsNotEmpty =
      this.phonesForm?.controls[index].get("label")?.value?.length > 2;

    const validators = labelIsNotEmpty ? [Validators.required] : [];
    if (isSpecialPhoneNumber) {
      validators.push(Validators.pattern(REGEXP.phone));
    }

    this.phonesForm?.controls[index]
      .get("phoneNumber")
      ?.setValidators(validators);

    this.phonesForm?.controls[index]
      .get("phoneNumber")
      ?.updateValueAndValidity();
  }

  public initPhones = (): void => {
    if (this.phonesData.length === 0) {
      this.phonesData = [
        {
          isSpecialPhoneNumber: false,
          countryCode: THEME_CONFIGURATION.country,
          label: null,
          phoneNumber: null,
        },
      ];
    }

    for (const phone of this.phonesData) {
      this.addNewPhone(phone);
    }
  };

  public addNewPhone = (phone?: Phone): void => {
    if (!phone) {
      phone = {
        isSpecialPhoneNumber: false,
        countryCode: THEME_CONFIGURATION.country,
        label: null,
        phoneNumber: null,
      };
    }

    this.phonesForm.push(
      new FormGroup({
        label: new FormControl(phone.label, [
          Validators.maxLength(100),
          Validators.minLength(3),
        ]),
        phoneNumber: new FormControl(
          phone.phoneNumber,
          phone.isSpecialPhoneNumber
            ? [Validators.pattern(REGEXP.phone)]
            : [phoneValidator]
        ),
        countryCode: new FormControl(
          phone?.countryCode ?? THEME_CONFIGURATION.country,
          []
        ),
        isSpecialPhoneNumber: new FormControl(phone.isSpecialPhoneNumber, []),
      })
    );
  };

  public removePhone = (i: number): void => {
    this.phonesForm.removeAt(i);
  };
}
