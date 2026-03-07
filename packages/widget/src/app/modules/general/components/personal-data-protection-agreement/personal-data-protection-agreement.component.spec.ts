import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PersonalDataProtectionAgreementComponent } from "./personal-data-protection-agreement.component";

describe("PersonalDataProtectionAgreementComponent", () => {
  let component: PersonalDataProtectionAgreementComponent;
  let fixture: ComponentFixture<PersonalDataProtectionAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalDataProtectionAgreementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalDataProtectionAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
