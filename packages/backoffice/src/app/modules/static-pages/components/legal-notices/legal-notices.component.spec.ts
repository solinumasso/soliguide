import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LegalNoticesComponent } from "./legal-notices.component";
import { NgComponentOutlet } from "@angular/common";
import { SeoService } from "../../../shared/services";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { LegalNoticesService } from "../../services/legal-notices.service";

describe("LegalNoticesComponent", () => {
  let component: LegalNoticesComponent;
  let fixture: ComponentFixture<LegalNoticesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgComponentOutlet, TranslateModule.forRoot()],
      providers: [
        TranslateService,
        SeoService,
        LegalNoticesService,
        CurrentLanguageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
