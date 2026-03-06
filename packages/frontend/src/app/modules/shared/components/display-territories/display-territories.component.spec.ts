import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayTerritoriesComponent } from "./display-territories.component";
import { ORGANIZATION_MOCK } from "../../../../../../mocks/ORGANIZATION.mock";

describe("DisplayTerritoriesComponent", () => {
  let component: DisplayTerritoriesComponent;
  let fixture: ComponentFixture<DisplayTerritoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayTerritoriesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTerritoriesComponent);
    component = fixture.componentInstance;
    component.organizationOrUser = ORGANIZATION_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
