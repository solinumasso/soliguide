import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { CampaignNoChangeModalComponent } from "./campaign-no-change-modal.component";

import { PosthogService } from "../../../analytics/services/posthog.service";

import { CampaignService } from "../../../campaign/services/campaign.service";

import { AuthService } from "../../../users/services/auth.service";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { CommonPosthogMockService } from "../../../../../../mocks/CommonPosthogMockService.mock";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";

describe("CampaignNoChangeModalComponent", () => {
  let component: CampaignNoChangeModalComponent;
  let fixture: ComponentFixture<CampaignNoChangeModalComponent>;
  let campaignService: CampaignService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignNoChangeModalComponent],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot({}),
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
    fixture = TestBed.createComponent(CampaignNoChangeModalComponent);
    campaignService = TestBed.inject(CampaignService);
    jest
      .spyOn(campaignService, "setNoChangeForPlace")
      .mockReturnValue(of(ONLINE_PLACE_MOCK));
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should set no change", () => {
    component.setNoChangeForPlace();
    expect(campaignService.setNoChangeForPlace).toHaveBeenCalled();
  });
});
