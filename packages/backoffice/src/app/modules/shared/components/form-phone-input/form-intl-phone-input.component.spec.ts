import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormIntlPhoneInputComponent } from "./form-intl-phone-input.component";
import { CountryCodes } from "@soliguide/common";
import { CountryISO, NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { PREFERRED_COUNTRIES } from "./constants";

describe("FormIntlPhoneInputComponent", () => {
  let component: FormIntlPhoneInputComponent;
  let fixture: ComponentFixture<FormIntlPhoneInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,
        NgxIntlTelInputModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({}),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormIntlPhoneInputComponent);
    component = fixture.componentInstance;

    component.PREFERRED_COUNTRIES = PREFERRED_COUNTRIES[
      CountryCodes.FR
    ] as CountryISO[];
    component.submitted = false;
    component.phone = {
      phoneNumber: "0606060606",
      isSpecialPhoneNumber: false,
      countryCode: CountryCodes.FR,
      label: "",
    };
    component.required = true;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(component.phoneForm).toBeTruthy();
    expect(component.phoneForm.value).toEqual({
      phone: { number: "606060606", countryCode: "fr" },
    });
  });
});
