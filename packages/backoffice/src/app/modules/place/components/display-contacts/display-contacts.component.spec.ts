import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { PlaceContact } from "@soliguide/common";

import { of } from "rxjs";

import { DisplayContactsComponent } from "./display-contacts.component";

import { PlaceContactsService } from "../../services/place-contacts.service";

import {
  ONLINE_PLACE_MOCK,
  PLACE_CONTACT_FOR_ADMIN_MOCK,
  USER_SOLIGUIDE_MOCK,
  CommonPosthogMockService,
} from "../../../../../../mocks";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("DisplayContactsComponent", () => {
  let component: DisplayContactsComponent;
  let fixture: ComponentFixture<DisplayContactsComponent>;
  let placeContactService: PlaceContactsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
      ],
      declarations: [DisplayContactsComponent],
      providers: [
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayContactsComponent);

    placeContactService = TestBed.inject(PlaceContactsService);

    component = fixture.componentInstance;

    component.me = USER_SOLIGUIDE_MOCK;
    component.template = "public";
    component.place = ONLINE_PLACE_MOCK;

    jest
      .spyOn(placeContactService, "getPlaceContacts")
      .mockReturnValue(of([PLACE_CONTACT_FOR_ADMIN_MOCK as PlaceContact]));

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(component.contacts).toStrictEqual([
      PLACE_CONTACT_FOR_ADMIN_MOCK as PlaceContact,
    ]);
    expect(component.nContacts).toBe(1);
  });
});
