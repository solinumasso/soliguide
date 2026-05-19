import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";

import { ResultsInfoBannerComponent } from "./results-info-banner.component";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { Categories, CountryCodes } from "@soliguide/common";

describe("ResultsInfoBannerComponent", () => {
  let component: ResultsInfoBannerComponent;
  let fixture: ComponentFixture<ResultsInfoBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ResultsInfoBannerComponent],
      imports: [TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
        provideHttpClient(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsInfoBannerComponent);
    component = fixture.componentInstance;
    component.category = Categories.PARENT_ASSISTANCE;
    component.areas = {
      slugs: {},
      country: CountryCodes.FR,
      pays: "france",
      regionCode: "11",
      departementCode: "75",
      codePostal: "75009",
      departement: "Paris",
      region: "Île-de-France",
      ville: "Paris",
    };
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
