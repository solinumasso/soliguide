import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { TranslateModule } from "@ngx-translate/core";

import {
  Categories,
  PlaceUpdateCampaign,
  BasePlaceTempInfo,
} from "@soliguide/common";

import { ToastrModule } from "ngx-toastr";

import { CampaignFormServicesComponent } from "./campaign-form-services.component";

import {
  CommonPosthogMockService,
  ONLINE_PLACE_MOCK,
  SERVICE_MOCK,
} from "../../../../../../mocks";

import { Place, Service } from "../../../../models/place/classes";
import { PosthogService } from "../../../analytics/services/posthog.service";

describe("FormCampaignServicesComponent", () => {
  let component: CampaignFormServicesComponent;
  let fixture: ComponentFixture<CampaignFormServicesComponent>;

  const c1 = {
    actif: true,
    dateDebut: null,
    dateFin: null,
  };

  const c2 = {
    actif: true,
    dateDebut: new Date(2021, 5, 21),
    dateFin: new Date(2021, 4, 21),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CampaignFormServicesComponent],
      imports: [
        RouterModule.forRoot([]),
        ToastrModule.forRoot({}),
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({}),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: "/" },
        { provide: PosthogService, useClass: CommonPosthogMockService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormServicesComponent);
    component = fixture.componentInstance;
    component.place = ONLINE_PLACE_MOCK;
    component.place.services_all = [SERVICE_MOCK];
    component.closeServiceForm = [
      {
        categorySpecificFields: "",
        category: Categories.PUBLIC_WRITER,
        close: new BasePlaceTempInfo(c1),
        serviceObjectId: SERVICE_MOCK.serviceObjectId,
      },
    ];
    component.place.campaigns.runningCampaign = new PlaceUpdateCampaign({
      toUpdate: true,
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should submit", () => {
    component.submitTempService();
  });

  it("should be invalid", () => {
    expect(component.loading).toBeFalsy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignFormServicesComponent);
    component = fixture.componentInstance;
    component.place = new Place();
    component.place.services_all = [new Service()];
    component.closeServiceForm = [
      {
        categorySpecificFields: "",
        category: Categories.DISABILITY_ADVICE,
        close: new BasePlaceTempInfo(c2),
        serviceObjectId: component.place.services_all[0].serviceObjectId,
      },
    ];
    component.place.campaigns.runningCampaign = new PlaceUpdateCampaign({
      toUpdate: true,
    });
    fixture.detectChanges();
  });

  it("should submit", () => {
    component.submitTempService();
  });

  it("should be invalid", () => {
    expect(component.loading).toBeFalsy();
  });
});
