import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { InfosComponent } from "./infos.component";

import { AdminPlaceService } from "../../services/admin-place.service";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks/ONLINE_PLACE.mock";
import { THEME_CONFIGURATION } from "../../../../models";
import { FixNavigationTriggeredOutsideAngularZoneNgModule } from "../../../../shared/modules/FixNavigationTriggeredOutsideAngularZoneNgModule.module";

describe("InfosComponent", () => {
  let component: InfosComponent;
  let fixture: ComponentFixture<InfosComponent>;
  let adminPlaceService: AdminPlaceService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InfosComponent],
      imports: [
        FixNavigationTriggeredOutsideAngularZoneNgModule,
        FormsModule,
        HttpClientTestingModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
          {
            path: `${THEME_CONFIGURATION.defaultLanguage}/manage-place/14270`,
            redirectTo: "",
          },
        ]),
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { lieu_id: 14270 },
            },
            params: of({
              lieu_id: 14270,
            }),
          },
        },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        // For CKEditor
        NO_ERRORS_SCHEMA,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfosComponent);
    adminPlaceService = TestBed.inject(AdminPlaceService);
    jest
      .spyOn(adminPlaceService, "getPlace")
      .mockReturnValue(of(ONLINE_PLACE_MOCK));
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should submit", () => {
    ONLINE_PLACE_MOCK.position.complementAdresse =
      "Un test de complément d'adresse";
    jest
      .spyOn(adminPlaceService, "create")
      .mockReturnValue(of(ONLINE_PLACE_MOCK));
    component.submitInfos();
    expect(ONLINE_PLACE_MOCK.position.complementAdresse).toBe(
      "Un test de complément d'adresse"
    );
  });
});
