import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute, RouterModule } from "@angular/router";

import { ToastrModule } from "ngx-toastr";

import { of } from "rxjs";

import { PlaceChangesPageComponent } from "./place-changes-page.component";

import { PlaceChangesService } from "../../services/place-changes.service";

import { AuthService } from "../../../users/services/auth.service";

import { PLACE_CHANGES_MOCK } from "../../../../../../mocks";
import { MockAuthService } from "../../../../../../mocks/MockAuthService";
import { TranslateModule } from "@ngx-translate/core";

describe("PlaceChangesPageComponent", () => {
  let component: PlaceChangesPageComponent;
  let fixture: ComponentFixture<PlaceChangesPageComponent>;
  let placeChangesService: PlaceChangesService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PlaceChangesPageComponent],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        ToastrModule.forRoot(),
        TranslateModule.forRoot({}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              id: "5fb61d3a3cb90874d9ab12e2",
            }),
          },
        },
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceChangesPageComponent);
    placeChangesService = TestBed.inject(PlaceChangesService);
    jest
      .spyOn(placeChangesService, "getVersion")
      .mockReturnValue(of(PLACE_CHANGES_MOCK));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
