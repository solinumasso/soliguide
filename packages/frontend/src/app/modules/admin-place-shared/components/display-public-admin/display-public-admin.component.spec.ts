import { CommonModule } from "@angular/common";
import { SharedModule } from "./../../../shared/shared.module";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";

import { DisplayPublicAdminComponent } from "./display-public-admin.component";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";
import { AdminPlaceSharedModule } from "../../admin-place-shared.module";

describe("DisplayPublicAdminComponent", () => {
  let component: DisplayPublicAdminComponent;
  let fixture: ComponentFixture<DisplayPublicAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayPublicAdminComponent],
      imports: [
        AdminPlaceSharedModule,
        CommonModule,
        SharedModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPublicAdminComponent);
    component = fixture.componentInstance;
    component.publics = ONLINE_PLACE_MOCK.publics;
    component.languages = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
