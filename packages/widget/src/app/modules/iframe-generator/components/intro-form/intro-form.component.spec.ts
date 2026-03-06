import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { IntroFormComponent } from "./intro-form.component";

describe("IntroFormComponent", () => {
  let component: IntroFormComponent;
  let fixture: ComponentFixture<IntroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IntroFormComponent],
      imports: [TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
