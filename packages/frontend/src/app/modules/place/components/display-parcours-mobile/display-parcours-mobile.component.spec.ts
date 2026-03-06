import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayParcoursMobileComponent } from "./display-parcours-mobile.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { CommonPosthogMockService } from "../../../../../../mocks";

describe("DisplayParcoursMobileComponent", () => {
  let component: DisplayParcoursMobileComponent;
  let fixture: ComponentFixture<DisplayParcoursMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayParcoursMobileComponent],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayParcoursMobileComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
