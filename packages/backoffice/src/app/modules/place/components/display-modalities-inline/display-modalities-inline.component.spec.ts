import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";

import { DisplayModalitiesInlineComponent } from "./display-modalities-inline.component";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("DisplayModalitiesInlineComponent", () => {
  let component: DisplayModalitiesInlineComponent;
  let fixture: ComponentFixture<DisplayModalitiesInlineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayModalitiesInlineComponent],
      imports: [
        FontAwesomeModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayModalitiesInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
