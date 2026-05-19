import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";

import { ListRolesComponent } from "./list-roles.component";
import { USER_SOLIGUIDE_MOCK } from "../../../../../../../mocks";
import { RouterModule } from "@angular/router";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ListRolesComponent", () => {
  let component: ListRolesComponent;
  let fixture: ComponentFixture<ListRolesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ListRolesComponent],
      imports: [
        FormsModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
        RouterModule.forRoot([]),
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRolesComponent);
    component = fixture.componentInstance;

    component.invitation = false;
    component.me = USER_SOLIGUIDE_MOCK;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
