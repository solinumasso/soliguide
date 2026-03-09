import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { INVITATION_MOCK } from "./../../../../../../mocks/INVITATION.mock";
import { ToastrModule } from "ngx-toastr";
import { AdminPlaceSharedModule } from "./../../admin-place-shared.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DisplayInvitationComponent } from "./display-invitation.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

describe("DisplayInvitationComponent", () => {
  let component: DisplayInvitationComponent;
  let fixture: ComponentFixture<DisplayInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayInvitationComponent],
      imports: [
        HttpClientTestingModule,
        AdminPlaceSharedModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot({}),
        FontAwesomeModule,
        RouterModule.forRoot([]),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayInvitationComponent);
    component = fixture.componentInstance;
    component.invitations = [INVITATION_MOCK];
    component.indexTable = 1;
    component.tableName = "orgas";
    component.loading = false;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
