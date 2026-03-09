import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DataProcessingAgreementComponent } from "./data-processing-agreement.component";
import { NgComponentOutlet } from "@angular/common";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { SeoService } from "../../../shared/services";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { DataProcessingAgreementService } from "../../services/data-processing-agreement.service";

describe("DataProcessingAgreementComponent", () => {
  let component: DataProcessingAgreementComponent;
  let fixture: ComponentFixture<DataProcessingAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgComponentOutlet, TranslateModule.forRoot()],
      providers: [
        TranslateService,
        SeoService,
        DataProcessingAgreementService,
        CurrentLanguageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataProcessingAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
