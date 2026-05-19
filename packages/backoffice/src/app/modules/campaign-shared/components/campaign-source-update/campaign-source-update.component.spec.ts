import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";

import { CampaignSourceUpdateComponent } from "./campaign-source-update.component";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
} from "../../../../../../mocks";
import { TranslateModule } from "@ngx-translate/core";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("CampaignSourceUpdateComponent", () => {
  let component: CampaignSourceUpdateComponent;
  let fixture: ComponentFixture<CampaignSourceUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignSourceUpdateComponent],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignSourceUpdateComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    component.placeIndex = 1;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
