import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../../../../shared/shared.module";
import { SingleContactComponent } from "./single-contact.component";
import { PosthogService } from "../../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../../mocks";
import { CountryCodes } from "@soliguide/common";
import { FormatInternationalPhoneNumberPipe } from "../../../../shared";

describe("SingleContactComponent", () => {
  let component: SingleContactComponent;
  let fixture: ComponentFixture<SingleContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleContactComponent],
      imports: [SharedModule, FormatInternationalPhoneNumberPipe],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleContactComponent);
    component = fixture.componentInstance;
    component.contact = {
      lastname: "Pro",
      mail: "contact-pro@structure-social.fr",
      name: "Contact",
      phone: {
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
        label: null,
      },
      title: "Contact pro",
    };
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
