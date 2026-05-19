import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { AdminPlaceComponent } from "./admin-place.component";
import { AdminPlaceService } from "../../../form-place/services/admin-place.service";
import { NotFoundComponent } from "../../../general/components/not-found/not-found.component";

import { PlaceContactsService } from "../../../place/services/place-contacts.service";

import { User } from "../../../users/classes";
import { AuthService } from "../../../users/services/auth.service";

import { Place } from "../../../../models/place/classes";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
  PLACE_CONTACT_FOR_ADMIN_MOCK,
  USER_PRO_MOCK,
} from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { THEME_CONFIGURATION } from "../../../../models";
import { PosthogService } from "../../../analytics/services/posthog.service";
import { registerLocales } from "../../../../shared/functions/registerLocales";
import { SharedModule } from "../../../shared";

describe("AdminPlaceComponent", () => {
  let component: AdminPlaceComponent;
  let fixture: ComponentFixture<AdminPlaceComponent>;
  let adminPlaceService: AdminPlaceService;

  let placeContactsService: PlaceContactsService;

  beforeAll(() => {
    registerLocales();
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPlaceComponent],
      imports: [
        HttpClientTestingModule,
        BrowserModule,
        NgbModule,
        RouterModule.forRoot([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/404`,
            component: NotFoundComponent,
          },
        ]),
        ToastrModule.forRoot({}),
        SharedModule,
        TranslateModule.forRoot({}),
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              lieu_id: "0",
            }),
          },
        },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPlaceComponent);

    adminPlaceService = TestBed.inject(AdminPlaceService);
    placeContactsService = TestBed.inject(PlaceContactsService);

    component = fixture.componentInstance;
    component.place = new Place(ONLINE_PLACE_MOCK);
    component.me = new User(USER_PRO_MOCK);

    component.place.photos = [];
    component.place.services_all = [];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("doit s'initialiser correctement", () => {
    jest
      .spyOn(adminPlaceService, "getPlace")
      .mockReturnValue(of(new Place(ONLINE_PLACE_MOCK)));
    jest.spyOn(adminPlaceService, "checkInOrga").mockReturnValue(of(true));
    jest
      .spyOn(placeContactsService, "getPlaceContacts")
      .mockReturnValue(of([PLACE_CONTACT_FOR_ADMIN_MOCK]));

    component.ngOnInit();
    expect(component.place).toMatchObject(new Place(ONLINE_PLACE_MOCK));
  });
});
