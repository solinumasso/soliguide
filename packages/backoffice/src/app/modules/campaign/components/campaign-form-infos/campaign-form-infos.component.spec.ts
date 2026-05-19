import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { PlaceUpdateCampaign } from "@soliguide/common";
import { SharedModule } from "../../../shared/shared.module";

import { ToastrModule } from "ngx-toastr";

import { CampaignFormInfosComponent } from "./campaign-form-infos.component";

import { Place } from "../../../../models/place/classes";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("FormCampaignInfosComponent", () => {
  let component: CampaignFormInfosComponent;
  let fixture: ComponentFixture<CampaignFormInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignFormInfosComponent],
      imports: [
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        SharedModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormInfosComponent);
    component = fixture.componentInstance;
    component.place = new Place();
    component.place.campaigns.runningCampaign = new PlaceUpdateCampaign({
      toUpdate: true,
    });
    component.place.campaigns.runningCampaign.sections.tempMessage = {
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
