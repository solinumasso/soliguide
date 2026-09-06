import { TranslateModule } from "@ngx-translate/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UntypedFormBuilder } from "@angular/forms";

import { RegistrationScope } from "@soliguide/common";

import { RegistrationsFormComponent } from "./registrations-form.component";

describe("RegistrationsFormComponent", () => {
  let component: RegistrationsFormComponent;
  let fixture: ComponentFixture<RegistrationsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationsFormComponent, TranslateModule.forRoot({})],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationsFormComponent);
    component = fixture.componentInstance;
    component.parentForm = new UntypedFormBuilder().group({
      registrations: [{}],
    });
    component.registrations = {};
  });

  it("should be created with one input per scheme proposed for the country", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.schemes).toEqual(["siret"]);
    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(1);
  });

  it("should prefill the inputs from the existing registrations", () => {
    component.registrations = {
      siret: {
        value: "73282932000074",
        scope: RegistrationScope.ESTABLISHMENT,
      },
    };
    fixture.detectChanges();
    expect(component.f["siret"].value).toBe("73282932000074");
  });

  it("should write the payload into the parent form, keeping an existing scope and the schemes absent from the form", () => {
    component.registrations = {
      siret: {
        value: "73282932000074",
        scope: RegistrationScope.ESTABLISHMENT,
      },
      rna: { value: "W751234567", scope: RegistrationScope.ORGANIZATION },
    };
    fixture.detectChanges();

    component.f["siret"].setValue("55210055400013");

    expect(component.parentForm.value.registrations).toEqual({
      siret: {
        value: "55210055400013",
        scope: RegistrationScope.ESTABLISHMENT,
      },
      rna: { value: "W751234567", scope: RegistrationScope.ORGANIZATION },
    });
    expect(component.parentForm.controls["registrations"].dirty).toBe(true);
  });

  it("should send null for an emptied input (removal)", () => {
    component.registrations = {
      siret: { value: "73282932000074", scope: RegistrationScope.ORGANIZATION },
    };
    fixture.detectChanges();
    component.f["siret"].setValue("");
    expect(component.parentForm.value.registrations).toEqual({ siret: null });
  });
});
