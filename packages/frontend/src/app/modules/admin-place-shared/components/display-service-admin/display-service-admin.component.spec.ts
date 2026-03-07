import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TranslateModule } from "@ngx-translate/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { DisplayServiceAdminComponent } from "./display-service-admin.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { CategoryTranslateKeyPipe } from "../../../shared/pipes";

describe("DisplayServiceAdminComponent", () => {
  let component: DisplayServiceAdminComponent;
  let fixture: ComponentFixture<DisplayServiceAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayServiceAdminComponent, CategoryTranslateKeyPipe],
      imports: [
        HttpClientTestingModule,
        NgbModule,
        TranslateModule.forRoot({}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayServiceAdminComponent);
    component = fixture.componentInstance;
    component.service = ONLINE_PLACE_MOCK.services_all[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
