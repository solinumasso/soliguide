import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { ManagePlaceChangesComponent } from "./manage-place-changes.component";

import { ManageCommonModule } from "../../../manage-common/manage-common.module";

import { AuthService } from "../../../users/services/auth.service";

import { MockAuthService } from "../../../../../../mocks/MockAuthService";

describe("ManagePlaceChangesComponent", () => {
  let component: ManagePlaceChangesComponent;
  let fixture: ComponentFixture<ManagePlaceChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        ManageCommonModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot(),
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: "/" },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ManagePlaceChangesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePlaceChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
