import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PlaceTransportsComponent } from "./place-transports.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("PlaceTransportsComponent", () => {
  let component: PlaceTransportsComponent;
  let fixture: ComponentFixture<PlaceTransportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceTransportsComponent],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaceTransportsComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
