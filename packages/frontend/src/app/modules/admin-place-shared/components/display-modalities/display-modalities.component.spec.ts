import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DisplayModalitiesComponent } from "./display-modalities.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { APP_BASE_HREF } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";

describe("DisplayModalitiesComponent", () => {
  let component: DisplayModalitiesComponent;
  let fixture: ComponentFixture<DisplayModalitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayModalitiesComponent],
      imports: [
        FontAwesomeModule,
        HttpClientTestingModule,
        TranslateModule,
        ToastrModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayModalitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
