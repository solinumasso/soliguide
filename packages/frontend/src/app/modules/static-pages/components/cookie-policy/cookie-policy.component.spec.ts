import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgComponentOutlet } from "@angular/common";
import { CookiePolicyComponent } from "./cookie-policy.component";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SeoService } from "../../../shared/services";
import { CookiePolicyService } from "../../services/cookie-policy.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";

describe("CookiePolicyComponent", () => {
  let component: CookiePolicyComponent;
  let fixture: ComponentFixture<CookiePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgComponentOutlet, TranslateModule.forRoot()],
      providers: [
        TranslateService,
        SeoService,
        CookiePolicyService,
        CurrentLanguageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CookiePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
