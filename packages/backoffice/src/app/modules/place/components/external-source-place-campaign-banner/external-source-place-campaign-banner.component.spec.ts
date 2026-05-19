import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { ExternalSourcePlaceCampaignBannerComponent } from "./external-source-place-campaign-banner.component";

import { PosthogService } from "../../../analytics/services/posthog.service";

import { AuthService } from "../../../users/services/auth.service";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { CommonPosthogMockService } from "../../../../../../mocks/CommonPosthogMockService.mock";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";

describe("ExternalSourcePlaceCampaignBannerComponent", () => {
  let component: ExternalSourcePlaceCampaignBannerComponent;
  let fixture: ComponentFixture<ExternalSourcePlaceCampaignBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalSourcePlaceCampaignBannerComponent],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      ExternalSourcePlaceCampaignBannerComponent
    );
    component = fixture.componentInstance;
    component.canEdit = true;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
