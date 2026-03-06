import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ManageSortIconComponent } from "./manage-sort-icon.component";
import { ManageSearchOptions } from "@soliguide/common";

describe("ManageSortIconComponent", () => {
  let component: ManageSortIconComponent;
  let fixture: ComponentFixture<ManageSortIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageSortIconComponent],
      imports: [FontAwesomeModule, BrowserModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSortIconComponent);
    component = fixture.componentInstance;

    component.options = new ManageSearchOptions();
    component.searchField = "createdAt";
    component.columnName = "Date de création";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
