import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { of } from "rxjs";

import { PublicsFormComponent } from "./publics-form.component";
import { MockAdminPlaceService } from "../../services/mocks/AdminPlaceService.mock";
import { AdminPlaceService } from "../../services/admin-place.service";
import { THEME_CONFIGURATION } from "../../../../models";
import { FixNavigationTriggeredOutsideAngularZoneNgModule } from "../../../../shared/modules/FixNavigationTriggeredOutsideAngularZoneNgModule.module";

describe("PublicsFormComponent", () => {
  let component: PublicsFormComponent;
  let fixture: ComponentFixture<PublicsFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PublicsFormComponent],
      imports: [
        BrowserAnimationsModule,
        FixNavigationTriggeredOutsideAngularZoneNgModule,
        HttpClientTestingModule,
        NgbModule,
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
            params: of({ lieu_id: "14270" }),
          },
        },
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
        { provide: AdminPlaceService, useClass: MockAdminPlaceService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicsFormComponent);

    component = fixture.componentInstance;
    TestBed.inject(AdminPlaceService);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should submit", () => {
    component.updatePublics();
    expect(component.success).toStrictEqual(true);
    expect(component.loading).toStrictEqual(false);
  });
});
