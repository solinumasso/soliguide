import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { PlaceUpdateCampaign } from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { CampaignFormClosedComponent } from "./campaign-form-closed.component";

import { TranslateModule } from "@ngx-translate/core";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
} from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("CampaignFormClosedComponent", () => {
  let component: CampaignFormClosedComponent;
  let fixture: ComponentFixture<CampaignFormClosedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignFormClosedComponent],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormClosedComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    component.place.campaigns.runningCampaign = new PlaceUpdateCampaign({
      toUpdate: true,
    });
    component.place.campaigns.runningCampaign.sections.tempClosure = {
      changes: false,
      date: null,
      updated: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
