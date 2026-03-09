import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayDocsComponent } from "./display-docs.component";
import { ToastrModule } from "ngx-toastr";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { TranslateModule } from "@ngx-translate/core";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("DisplayDocsComponent", () => {
  let component: DisplayDocsComponent;
  let fixture: ComponentFixture<DisplayDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ToastrModule.forRoot({}),
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
      ],
      declarations: [DisplayDocsComponent],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDocsComponent);
    component = fixture.componentInstance;
    component.docs = ONLINE_PLACE_MOCK.modalities.docs;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
