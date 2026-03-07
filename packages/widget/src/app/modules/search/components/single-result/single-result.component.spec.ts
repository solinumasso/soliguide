import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { TranslateModule } from "@ngx-translate/core";

import { SingleResultComponent } from "./single-result.component";

import { KmToMeters } from "../../pipes/convert-km-to-meters.pipe";
import { LimitToPipe } from "../../pipes/limit-to.pipe";

import { DEFAULT_WIDGET_PLACE } from "../../../../models";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../analytics/mocks/CommonPosthogMockService.mock";
import { FormatInternationalPhoneNumberPipe } from "../../../shared/pipes/formatInternationalPhoneNumber.pipe";

describe("SingleResultComponent", () => {
  let component: SingleResultComponent;
  let fixture: ComponentFixture<SingleResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleResultComponent, LimitToPipe, KmToMeters],
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot({}),
        FormatInternationalPhoneNumberPipe,
      ],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleResultComponent);
    component = fixture.componentInstance;
    component.place = DEFAULT_WIDGET_PLACE;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
