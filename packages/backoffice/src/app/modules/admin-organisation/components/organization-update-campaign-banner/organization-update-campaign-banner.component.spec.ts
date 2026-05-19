import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { OrganizationUpdateCampaignBannerComponent } from "./organization-update-campaign-banner.component";

import { User } from "../../../users/classes/user.class";

import {
  CommonPosthogMockService,
  ORGANIZATION_MOCK,
  ONLINE_PLACE_MOCK,
  USER_PRO_MOCK,
} from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";

ORGANIZATION_MOCK.places.push(ONLINE_PLACE_MOCK);

describe("OrganizationUpdateCampaignBannerComponent", () => {
  let component: OrganizationUpdateCampaignBannerComponent;
  let fixture: ComponentFixture<OrganizationUpdateCampaignBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationUpdateCampaignBannerComponent],
      imports: [RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(
      OrganizationUpdateCampaignBannerComponent
    );
    component = fixture.componentInstance;
    component.me = new User(USER_PRO_MOCK);
    component.organisation = ORGANIZATION_MOCK;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
