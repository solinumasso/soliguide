import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { ToastrModule, ToastrService } from "ngx-toastr";

import { AuthService } from "../../../users/services/auth.service";
import { AvailableSourceService } from "../../services/available-source.service";
import { CurrentLanguageService } from "../../../general/services/current-language.service";
import { SoligareSearchService } from "../../services/soligare-search.service";
import { SoligarePairingComponent } from "./soligare-pairing.component";
import { SharedModule } from "../../../shared/shared.module";
import { MockAuthService } from "../../../../../../mocks";
import { SoligareModule } from "../../soligare.module";

describe("SoligarePairingComponent", () => {
  let component: SoligarePairingComponent;
  let fixture: ComponentFixture<SoligarePairingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoligarePairingComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule,
        SoligareModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        CurrentLanguageService,
        SoligareSearchService,
        TranslateService,
        ToastrService,
        AvailableSourceService,
        { provide: AuthService, useClass: MockAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoligarePairingComponent);
    component = fixture.componentInstance;
    component.searchPairing.territories = ["75"];
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });
});
