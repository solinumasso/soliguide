import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormPhoneInputComponent } from "./form-phone-input.component";
import { CountryCodes } from "@soliguide/common";

describe("FormPhoneInputComponent", () => {
  let component: FormPhoneInputComponent;
  let fixture: ComponentFixture<FormPhoneInputComponent>;

  const formBuilder = new FormBuilder();
  const form = formBuilder.group({
    entity: formBuilder.group({ phones: formBuilder.array([]) }),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPhoneInputComponent);
    component = fixture.componentInstance;

    component.submitted = false;
    component.phoneLabelPlaceholder = "placeHolder";
    component.phone = {
      phoneNumber: "0606060606",
      isSpecialPhoneNumber: false,
      countryCode: CountryCodes.FR,
      label: "",
    };
    component.index = 0;
    component.needLabel = false;
    component.parentForm = form.controls.entity as FormGroup;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
