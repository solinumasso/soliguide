import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { APP_BASE_HREF } from "@angular/common";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { TranslateModule } from "@ngx-translate/core";
import { ToastrModule } from "ngx-toastr";

import { Modalities } from "@soliguide/common";

import { DisplayModalitiesComponent } from "./display-modalities.component";
import { NO_CHANGE } from "./display-modalities.models";

describe("DisplayModalitiesComponent", () => {
  let component: DisplayModalitiesComponent;
  let fixture: ComponentFixture<DisplayModalitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayModalitiesComponent],
      imports: [
        FontAwesomeModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({}),
        ToastrModule.forRoot({}),
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: "/" }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayModalitiesComponent);
    component = fixture.componentInstance;
    component.modalities = new Modalities();
    component.isHistory = false;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("sans oldModalities", () => {
    it("conserve NO_CHANGE", () => {
      expect(component.changes).toEqual(NO_CHANGE);
    });
  });

  describe("avec oldModalities", () => {
    describe("inconditionnel", () => {
      it("détecte l'ajout (false → true)", () => {
        component.oldModalities = new Modalities({ inconditionnel: false });
        component.modalities = new Modalities({ inconditionnel: true });
        component.ngOnInit();
        expect(component.changes.unconditional).toEqual({
          added: true,
          removed: false,
        });
      });

      it("détecte la suppression (true → false)", () => {
        component.oldModalities = new Modalities({ inconditionnel: true });
        component.modalities = new Modalities({ inconditionnel: false });
        component.ngOnInit();
        expect(component.changes.unconditional).toEqual({
          added: false,
          removed: true,
        });
      });

      it("ne détecte aucun changement (true → true)", () => {
        component.oldModalities = new Modalities({ inconditionnel: true });
        component.modalities = new Modalities({ inconditionnel: true });
        component.ngOnInit();
        expect(component.changes.unconditional).toEqual({
          added: false,
          removed: false,
        });
      });
    });

    describe("champs avec précisions", () => {
      const fields = [
        "orientation",
        "inscription",
        "appointment",
        "price",
      ] as const;

      for (const field of fields) {
        describe(field, () => {
          it("détecte l'ajout (unchecked → checked)", () => {
            component.oldModalities = new Modalities({
              [field]: { checked: false, precisions: null },
            });
            component.modalities = new Modalities({
              [field]: { checked: true, precisions: null },
            });
            component.ngOnInit();
            expect(component.changes[field].added).toBe(true);
            expect(component.changes[field].removed).toBe(false);
          });

          it("détecte la suppression (checked → unchecked)", () => {
            component.oldModalities = new Modalities({
              [field]: { checked: true, precisions: null },
            });
            component.modalities = new Modalities({
              [field]: { checked: false, precisions: null },
            });
            component.ngOnInit();
            expect(component.changes[field].added).toBe(false);
            expect(component.changes[field].removed).toBe(true);
          });

          it("détecte le changement de précisions quand checked", () => {
            component.oldModalities = new Modalities({
              [field]: { checked: true, precisions: "avant" },
            });
            component.modalities = new Modalities({
              [field]: { checked: true, precisions: "après" },
            });
            component.ngOnInit();
            expect(component.changes[field].precisionsChanged).toBe(true);
          });

          it("n'indique pas de changement de précisions quand non checked", () => {
            component.oldModalities = new Modalities({
              [field]: { checked: false, precisions: "avant" },
            });
            component.modalities = new Modalities({
              [field]: { checked: false, precisions: "après" },
            });
            component.ngOnInit();
            expect(component.changes[field].precisionsChanged).toBe(false);
          });

          it("n'indique pas de changement de précisions si identiques", () => {
            component.oldModalities = new Modalities({
              [field]: { checked: true, precisions: "identique" },
            });
            component.modalities = new Modalities({
              [field]: { checked: true, precisions: "identique" },
            });
            component.ngOnInit();
            expect(component.changes[field].precisionsChanged).toBe(false);
          });
        });
      }
    });

    describe("champs checked uniquement", () => {
      const fields = ["pmr", "animal"] as const;

      for (const field of fields) {
        describe(field, () => {
          it("détecte l'ajout (unchecked → checked)", () => {
            component.oldModalities = new Modalities({
              [field]: { checked: false },
            });
            component.modalities = new Modalities({
              [field]: { checked: true },
            });
            component.ngOnInit();
            expect(component.changes[field]).toEqual({
              added: true,
              removed: false,
            });
          });

          it("détecte la suppression (checked → unchecked)", () => {
            component.oldModalities = new Modalities({
              [field]: { checked: true },
            });
            component.modalities = new Modalities({
              [field]: { checked: false },
            });
            component.ngOnInit();
            expect(component.changes[field]).toEqual({
              added: false,
              removed: true,
            });
          });

          it("ne détecte aucun changement (checked → checked)", () => {
            component.oldModalities = new Modalities({
              [field]: { checked: true },
            });
            component.modalities = new Modalities({
              [field]: { checked: true },
            });
            component.ngOnInit();
            expect(component.changes[field]).toEqual({
              added: false,
              removed: false,
            });
          });
        });
      }
    });

    describe("other", () => {
      it("détecte un changement de valeur", () => {
        component.oldModalities = new Modalities({ other: "avant" });
        component.modalities = new Modalities({ other: "après" });
        component.ngOnInit();
        expect(component.changes.other).toBe(true);
      });

      it("ne détecte pas de changement si identique", () => {
        component.oldModalities = new Modalities({ other: "même" });
        component.modalities = new Modalities({ other: "même" });
        component.ngOnInit();
        expect(component.changes.other).toBe(false);
      });

      it("détecte le passage de null à une valeur", () => {
        component.oldModalities = new Modalities({ other: null });
        component.modalities = new Modalities({ other: "nouveau" });
        component.ngOnInit();
        expect(component.changes.other).toBe(true);
      });
    });
  });
});
