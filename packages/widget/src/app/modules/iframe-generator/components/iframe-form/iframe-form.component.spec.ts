import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { IframeFormComponent } from "./iframe-form.component";

describe("IframeGeneratorComponent", () => {
  let component: IframeFormComponent;
  let fixture: ComponentFixture<IframeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IframeFormComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot({})],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IframeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
