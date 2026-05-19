import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/compiler";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { TranslateModule } from "@ngx-translate/core";

import { ListInvitationsComponent } from "./list-invitations.component";

import { InviteUserService } from "../../services/invite-user.service";

import { SharedModule } from "../../../shared/shared.module";

import {
  INVITATION_MOCK,
  ORGANIZATION_MOCK,
  CommonPosthogMockService,
} from "../../../../../../mocks";

import { PosthogService } from "../../../analytics/services/posthog.service";

describe("ListInvitationsComponent", () => {
  let component: ListInvitationsComponent;
  let fixture: ComponentFixture<ListInvitationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListInvitationsComponent],
      imports: [
        HttpClientTestingModule,
        SharedModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
        ToastrModule.forRoot({}),
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents()
      .catch((e) => {
        throw e;
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListInvitationsComponent);
    component = fixture.componentInstance;
    component.organisation = ORGANIZATION_MOCK;

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  describe("Suppression d'une invitation", () => {
    it("devrait supprimer une invitation", () => {
      const deleteInviteSpy = jest
        .spyOn(InviteUserService.prototype, "deleteInvitation")
        .mockReturnValue(of({ message: "OK" }));

      component.organisation.invitations = [INVITATION_MOCK];

      component.deleteInvitation(INVITATION_MOCK);

      expect(component.organisation.invitations.indexOf(INVITATION_MOCK)).toBe(
        -1
      );
      expect(deleteInviteSpy).toHaveBeenCalled();
    });
  });
});
