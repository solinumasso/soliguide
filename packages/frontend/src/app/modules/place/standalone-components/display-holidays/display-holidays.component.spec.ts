import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayHolidaysComponent } from "./display-holidays.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("DisplayHolidaysComponent", () => {
  let component: DisplayHolidaysComponent;
  let fixture: ComponentFixture<DisplayHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DisplayHolidaysComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
