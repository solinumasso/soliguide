import { ToastrModule } from "ngx-toastr";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharePlaceComponent } from "./share-place.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "../../../shared/shared.module";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { ShareButtons } from "ngx-sharebuttons/buttons";

describe("SharePlaceComponent", () => {
  let component: SharePlaceComponent;
  let fixture: ComponentFixture<SharePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharePlaceComponent],
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        ToastrModule.forRoot({}),
        NgbModule,
        ShareButtons,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharePlaceComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
