import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { of } from "rxjs";

import { PlaceEmplacementFormComponent } from "./place-emplacement-form.component";

import { AdminPlaceService } from "../../services/admin-place.service";

import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";
import { THEME_CONFIGURATION } from "../../../../models";

describe("PlaceEmplacementFormComponent", () => {
  let component: PlaceEmplacementFormComponent;
  let fixture: ComponentFixture<PlaceEmplacementFormComponent>;
  let adminPlaceService: AdminPlaceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceEmplacementFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({}),
      ],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: `/${THEME_CONFIGURATION.defaultLanguage}`,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({
              lieu_id: ONLINE_PLACE_MOCK.lieu_id,
            }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceEmplacementFormComponent);
    component = fixture.componentInstance;
    adminPlaceService = TestBed.inject(AdminPlaceService);
    jest
      .spyOn(adminPlaceService, "getPlace")
      .mockReturnValue(of(ONLINE_PLACE_MOCK));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
