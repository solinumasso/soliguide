import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { TranslateModule } from "@ngx-translate/core";

import { ToastrModule, ToastrService } from "ngx-toastr";

import { InviteFormComponent } from "./invite-form.component";

import { Place } from "../../../../models/place/classes";

import { ORGANIZATION_MOCK } from "../../../../../../mocks";

describe("InviteFormComponent", () => {
  let component: InviteFormComponent;
  let fixture: ComponentFixture<InviteFormComponent>;
  let places: string[];
  let toastr: ToastrService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InviteFormComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({}),
        TranslateModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    places = ORGANIZATION_MOCK.places.map((place: Place) => place._id);
    fixture = TestBed.createComponent(InviteFormComponent);
    component = fixture.componentInstance;
    component.inviteForm = new FormGroup({
      lastname: new FormControl(),
      mail: new FormControl(),
      name: new FormControl(),
      organizationName: new FormControl(),
      phone: new FormControl(),
      role: new FormControl(),
      title: new FormControl(),
    });
    component.organisation = ORGANIZATION_MOCK;
    component.places = places;
    jest.spyOn(component.placesChange, "emit");
    fixture.detectChanges();
  });

  it("Doit créer le composant", () => {
    expect(component).toBeTruthy();
  });

  it("Doit retirer puis remettre l'unique place de l'orga dans le tableau des places", () => {
    toastr = TestBed.inject(ToastrService);
    jest.spyOn(toastr, "error");
    component.addToPlace(places[0]);
    expect(toastr.error).toHaveBeenCalled();
    component.addToPlace(places[0]);
    expect(component.places).toEqual(places);
  });
});
