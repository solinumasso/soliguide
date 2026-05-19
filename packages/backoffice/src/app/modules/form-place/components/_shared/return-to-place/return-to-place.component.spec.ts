import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { THEME_CONFIGURATION } from "../../../../../models";
import { ReturnToPlaceComponent } from "./return-to-place.component";

describe("ReturnToPlaceComponent", () => {
  let component: ReturnToPlaceComponent;
  let fixture: ComponentFixture<ReturnToPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnToPlaceComponent],
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([])],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnToPlaceComponent);
    component = fixture.componentInstance;
    component.returnUrl = {
      url: [`/${THEME_CONFIGURATION.defaultLanguage}/manage-place`, 23],
      queryParams: {},
    };
    component.buttonText = "Test Button";
    component.buttonTitle = "Test title";

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
