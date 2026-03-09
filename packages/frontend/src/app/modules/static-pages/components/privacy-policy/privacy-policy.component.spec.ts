import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PrivacyPolicyComponent } from "./privacy-policy.component";
import { NgComponentOutlet } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SeoService } from "../../../shared/services";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { PrivacyPolicyService } from "../../services/privacy-policy.service";

describe("PrivacyPolicyComponent", () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgComponentOutlet, TranslateModule.forRoot()],
      providers: [
        TranslateService,
        SeoService,
        PrivacyPolicyService,
        CurrentLanguageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
