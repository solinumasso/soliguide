import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { TempInfoType, BasePlaceTempInfo } from "@soliguide/common";

import { addDays, subDays } from "date-fns";

import { DisplayTempBannerComponent } from "./display-temp-banner.component";

import { DateService } from "../../services/date.service";

import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";
import { CommonModule } from "@angular/common";
import {
  FontAwesomeModule,
  FaIconLibrary,
} from "@fortawesome/angular-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

const today = new Date();
const oneWeekLater = new Date(today);
const yesterday = new Date(today);

oneWeekLater.setDate(today.getDate() + 7);
yesterday.setDate(today.getDate() - 1);

describe("DisplayTempBannerComponent", () => {
  let component: DisplayTempBannerComponent;
  let fixture: ComponentFixture<DisplayTempBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        DateService,
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      imports: [
        TranslateModule.forRoot(),
        DisplayTempBannerComponent,
        FontAwesomeModule,
        CommonModule,
      ],
    }).compileComponents();

    const library = TestBed.inject(FaIconLibrary);
    library.addIconPacks(fas);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTempBannerComponent);
    component = fixture.componentInstance;
    component.tempInfos = new BasePlaceTempInfo({
      dateDebut: subDays(new Date(), 1),
      dateFin: addDays(new Date(), 8),
      hours: null,
    });

    component.tempInfoType = TempInfoType.HOURS;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should toggle temporary hours", () => {
    expect(component.tempInfos.actif).toBe(true);
    expect(component.tempInfos.infoColor).toBe("danger");

    component.toogleDisplayTempHours(true);
    expect(component.displayTempHours).toBe(true);
  });
});
