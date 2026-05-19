import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { LieuPositionFormComponent } from "./lieu-position-form.component";

import { AdminPlaceService } from "../../../services/admin-place.service";

import { ONLINE_PLACE_MOCK } from "../../../../../../../mocks";

describe("LieuPositionFormComponent", () => {
  let component: LieuPositionFormComponent;
  let fixture: ComponentFixture<LieuPositionFormComponent>;
  let adminPlaceService: AdminPlaceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LieuPositionFormComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LieuPositionFormComponent);
    adminPlaceService = TestBed.inject(AdminPlaceService);
    jest.spyOn(adminPlaceService, "checkInOrga").mockReturnValue(of(false));
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
