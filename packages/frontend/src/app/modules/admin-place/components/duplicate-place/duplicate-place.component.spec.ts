import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { Place } from "../../../../models/place/classes";

import { DuplicatePlaceComponent } from "./duplicate-place.component";

import { USER_PRO_MOCK } from "../../../../../../mocks";
import { User } from "../../../users/classes/user.class";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { AuthService } from "../../../users/services/auth.service";
import { TranslateModule } from "@ngx-translate/core";

describe("DuplicatePlaceComponent", () => {
  let component: DuplicatePlaceComponent;
  let fixture: ComponentFixture<DuplicatePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicatePlaceComponent],
      imports: [
        HttpClientTestingModule,
        BrowserModule,
        NgbModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: "/" },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicatePlaceComponent);
    component = fixture.componentInstance;
    component.place = new Place();
    component.user = new User(USER_PRO_MOCK);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
