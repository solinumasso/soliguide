import { TranslateModule } from "@ngx-translate/core";
import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { TempInfoType, TempInfoStatus } from "@soliguide/common";

import { DisplayTempInfoAdminComponent } from "./display-temp-info-admin.component";

import { SharedModule } from "../../../shared/shared.module";
import { ONLINE_PLACE_MOCK } from "../../../../../../mocks";
import { Place } from "../../../../models";

describe("DisplayTempInfoAdminComponent", () => {
  let component: DisplayTempInfoAdminComponent;
  let fixture: ComponentFixture<DisplayTempInfoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayTempInfoAdminComponent],
      imports: [SharedModule, TranslateModule.forRoot({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayTempInfoAdminComponent);
    component = fixture.componentInstance;

    component.tempInfo = {
      _id: "xxx",
      name: null,
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tempInfoType: TempInfoType.CLOSURE,
      status: TempInfoStatus.CURRENT,
      placeId: 1,
      dateDebut: new Date(2021, 5, 21),
      dateFin: new Date(2021, 4, 21),
      place: new Place(ONLINE_PLACE_MOCK),
      actif: true,
      isCampaign: false,
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
