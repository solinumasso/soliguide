import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TranslateModule } from "@ngx-translate/core";

import { DisplayPositionAdminComponent } from "./display-position-admin.component";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";

describe("DisplayPositionAdminComponent", () => {
  let component: DisplayPositionAdminComponent;
  let fixture: ComponentFixture<DisplayPositionAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayPositionAdminComponent],
      imports: [TranslateModule.forRoot({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPositionAdminComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
