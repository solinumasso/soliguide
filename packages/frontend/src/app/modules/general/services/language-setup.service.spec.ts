import { TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { LanguageSetupService } from "./language-setup.service";

describe("LanguageSetupService", () => {
  let service: LanguageSetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), TranslateModule.forRoot({})],
    }).compileComponents();
    service = TestBed.inject(LanguageSetupService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
