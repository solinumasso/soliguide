import { ActivatedRoute } from "@angular/router";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrModule, ToastrService } from "ngx-toastr";

import { AuthService } from "../../../users/services/auth.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { SoligareSearchService } from "../../services/soligare-search.service";
import { SoligarePreviewComponent } from "./soligare-preview.component";
import { SharedModule } from "../../../shared/shared.module";
import { MockAuthService } from "../../../../../../mocks";

describe("SoligarePreviewComponent", () => {
  let component: SoligarePreviewComponent;
  let fixture: ComponentFixture<SoligarePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoligarePreviewComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        CurrentLanguageService,
        ToastrService,
        TranslateService,
        SoligareSearchService,
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              source_id: "086baa25-18e9-fab2-f6eb-3b54d6efb09f",
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoligarePreviewComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
