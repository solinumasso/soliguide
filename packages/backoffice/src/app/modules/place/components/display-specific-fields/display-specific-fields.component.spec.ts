import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplaySpecificFieldsComponent } from "./display-specific-fields.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";
import { TranslateModule } from "@ngx-translate/core";

describe("DisplaySpecificFieldsComponent", () => {
  let component: DisplaySpecificFieldsComponent;
  let fixture: ComponentFixture<DisplaySpecificFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplaySpecificFieldsComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplaySpecificFieldsComponent);
    component = fixture.componentInstance;
    component.service = ONLINE_PLACE_MOCK.services_all[0];
    component.specificField = "foodProductType";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
