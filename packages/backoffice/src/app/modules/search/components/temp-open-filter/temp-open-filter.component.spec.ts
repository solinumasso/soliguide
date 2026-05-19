import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { TempOpenFilterComponent } from "./temp-open-filter.component";

describe("TempOpenFilterComponent", () => {
  let component: TempOpenFilterComponent;
  let fixture: ComponentFixture<TempOpenFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TempOpenFilterComponent],
      imports: [TranslateModule.forRoot({})],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempOpenFilterComponent);
    component = fixture.componentInstance;
    component.filters = { openToday: true };
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
